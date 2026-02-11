import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export interface InstagramPost {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

interface InstagramAPIResponse {
  data: InstagramPost[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

// Cache the response for 1 hour
let cachedData: { posts: InstagramPost[]; timestamp: number } | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

const INSTAGRAM_ACCOUNT_ID = '17841401820808513'

async function getAccessToken(): Promise<string | null> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings.instagramAccessToken) {
      return settings.instagramAccessToken
    }
  } catch (e) {
    console.error('Failed to read token from DB, falling back to env:', e)
  }
  return process.env.INSTAGRAM_ACCESS_TOKEN || null
}

export async function GET() {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 },
      )
    }

    // Check cache
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({ posts: cachedData.posts, cached: true })
    }

    // Fetch media from Instagram Graph API
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
    const limit = 12

    const response = await fetch(
      `https://graph.facebook.com/v24.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Instagram API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch Instagram posts', details: errorData },
        { status: response.status },
      )
    }

    const data: InstagramAPIResponse = await response.json()

    // Update cache
    cachedData = {
      posts: data.data,
      timestamp: Date.now(),
    }

    return NextResponse.json({ posts: data.data, cached: false })
  } catch (error) {
    console.error('Instagram fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
