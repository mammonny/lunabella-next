import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Start alerting this many days before the token (or its data access) expires
const ALERT_THRESHOLD_DAYS = 14

type DebugTokenData = {
  is_valid: boolean
  type?: string
  expires_at?: number // unix seconds, 0 = never
  data_access_expires_at?: number // unix seconds, 0 = never
  error?: { message: string }
}

/**
 * Daily health check for the Instagram token.
 *
 * Long-lived user tokens cannot be extended: exchanging one again via fb_exchange_token
 * returns a new token with the SAME expiry date, so the old "auto-renew" silently did
 * nothing. The stored token is now a Page access token (no expiry); this cron only checks
 * it with debug_token and emails the admins if it is invalid or about to expire.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const token = settings.instagramAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN

    const problems: string[] = []
    let info: DebugTokenData | null = null

    if (!token) {
      problems.push('No hay token de Instagram ni en la base de datos ni en las variables de entorno.')
    } else {
      const debugUrl = new URL('https://graph.facebook.com/v24.0/debug_token')
      debugUrl.searchParams.set('input_token', token)
      debugUrl.searchParams.set(
        'access_token',
        `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
      )

      const response = await fetch(debugUrl.toString(), { cache: 'no-store' })
      const json = await response.json()
      info = json.data ?? null

      if (!info) {
        problems.push(`No se pudo verificar el token (debug_token): ${JSON.stringify(json.error ?? json)}`)
      } else {
        if (!info.is_valid) {
          problems.push(`El token ya no es válido: ${info.error?.message ?? 'motivo desconocido'}`)
        }

        const deadlines: [string, number | undefined][] = [
          ['El token caduca', info.expires_at],
          ['El acceso a datos del token caduca', info.data_access_expires_at],
        ]
        for (const [label, ts] of deadlines) {
          if (!ts) continue
          const days = (ts * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
          if (days < ALERT_THRESHOLD_DAYS) {
            problems.push(`${label} el ${new Date(ts * 1000).toISOString()} (en ${Math.round(days)} días).`)
          }
        }
      }
    }

    // Keep the date shown in the admin panel truthful: whichever deadline comes first
    // (token expiry or data access expiry), null if neither applies
    if (info?.is_valid) {
      const deadlines = [info.expires_at, info.data_access_expires_at].filter((ts): ts is number => !!ts)
      const expiresAt = deadlines.length
        ? new Date(Math.min(...deadlines) * 1000).toISOString()
        : null
      if (expiresAt !== (settings.instagramTokenExpiresAt ?? null)) {
        await payload.updateGlobal({
          slug: 'site-settings',
          data: { instagramTokenExpiresAt: expiresAt },
        })
      }
    }

    if (problems.length > 0) {
      payload.logger.error(`Instagram token check failed: ${problems.join(' | ')}`)

      const admins = await payload.find({
        collection: 'usuarios',
        where: { roles: { equals: 'admin' } },
        depth: 0,
        limit: 10,
      })
      const to = admins.docs.map((user) => user.email).filter(Boolean)

      if (to.length > 0) {
        await payload.sendEmail({
          to,
          subject: '⚠️ El feed de Instagram de lunabella.es necesita atención',
          html: `
            <p>La comprobación diaria del token de Instagram ha detectado un problema:</p>
            <ul>${problems.map((p) => `<li>${p}</li>`).join('')}</ul>
            <p>Hay que generar un token nuevo en el Graph API Explorer (app <strong>lunabellafeed</strong>)
            y guardar el token de página resultante en <code>site_settings.instagram_access_token</code>.</p>
          `,
        })
      }

      return NextResponse.json({ ok: false, problems, notified: to.length }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      type: info?.type,
      expiresAt: info?.expires_at ? new Date(info.expires_at * 1000).toISOString() : 'never',
      dataAccessExpiresAt: info?.data_access_expires_at
        ? new Date(info.data_access_expires_at * 1000).toISOString()
        : 'never',
    })
  } catch (error) {
    console.error('Instagram token check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
