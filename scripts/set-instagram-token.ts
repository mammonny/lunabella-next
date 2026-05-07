import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const token = process.env.IG_TOKEN
  const expiresInSec = Number(process.env.IG_EXPIRES_IN || 60 * 60 * 24 * 60)

  if (!token) {
    console.error('Missing IG_TOKEN env var')
    process.exit(1)
  }

  const expiresAt = new Date(Date.now() + expiresInSec * 1000)

  const payload = await getPayload({ config })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      instagramAccessToken: token,
      instagramTokenExpiresAt: expiresAt.toISOString(),
    },
  })

  console.log(`Token saved. Expires at: ${expiresAt.toISOString()}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
