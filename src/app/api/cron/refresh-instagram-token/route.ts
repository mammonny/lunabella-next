import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    // Read current token from DB
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const currentToken = settings.instagramAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN

    if (!currentToken) {
      return NextResponse.json({ error: 'No Instagram token found in DB or env' }, { status: 500 })
    }

    // Check if token needs renewal (expires in less than 14 days)
    const expiresAt = settings.instagramTokenExpiresAt
      ? new Date(settings.instagramTokenExpiresAt)
      : null

    if (expiresAt) {
      const daysUntilExpiry = (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      if (daysUntilExpiry > 14) {
        return NextResponse.json({
          message: 'Token still valid',
          expiresAt: expiresAt.toISOString(),
          daysUntilExpiry: Math.round(daysUntilExpiry),
        })
      }
      payload.logger.info(`Instagram token expires in ${Math.round(daysUntilExpiry)} days, renewing...`)
    } else {
      payload.logger.info('No expiration date found, renewing token...')
    }

    // Exchange for a new long-lived token
    const refreshUrl = new URL('https://graph.facebook.com/v24.0/oauth/access_token')
    refreshUrl.searchParams.set('grant_type', 'fb_exchange_token')
    refreshUrl.searchParams.set('client_id', process.env.FACEBOOK_APP_ID || '')
    refreshUrl.searchParams.set('client_secret', process.env.FACEBOOK_APP_SECRET || '')
    refreshUrl.searchParams.set('fb_exchange_token', currentToken)

    const response = await fetch(refreshUrl.toString())

    if (!response.ok) {
      const errorData = await response.json()
      payload.logger.error(`Instagram token refresh failed: ${JSON.stringify(errorData)}`)
      return NextResponse.json(
        { error: 'Failed to refresh token', details: errorData },
        { status: 502 },
      )
    }

    const data: { access_token: string; token_type: string; expires_in: number } =
      await response.json()

    const newExpiresAt = new Date(Date.now() + data.expires_in * 1000)

    // Save new token to DB
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        instagramAccessToken: data.access_token,
        instagramTokenExpiresAt: newExpiresAt.toISOString(),
      },
    })

    payload.logger.info(`Instagram token renewed, expires at ${newExpiresAt.toISOString()}`)

    return NextResponse.json({
      message: 'Token refreshed successfully',
      expiresAt: newExpiresAt.toISOString(),
      daysUntilExpiry: Math.round(data.expires_in / 86400),
    })
  } catch (error) {
    console.error('Instagram token refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
