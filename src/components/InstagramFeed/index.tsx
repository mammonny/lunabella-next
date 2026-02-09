'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface InstagramPost {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function CarouselIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-100 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
        <InstagramIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No se pudo cargar el feed</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Hubo un problema al conectar con Instagram. Por favor, intenta de nuevo.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium transition-all hover:bg-gray-800"
      >
        Reintentar
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#a58a1b]/10 flex items-center justify-center">
        <InstagramIcon className="w-8 h-8 text-[#a58a1b]" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Configura tu feed de Instagram</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Añade tu token de Instagram en las variables de entorno para mostrar tus publicaciones.
      </p>
    </div>
  )
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    setError(false)

    try {
      const response = await fetch('/api/instagram')
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch')
      }

      setPosts(data.posts || [])
    } catch (err) {
      console.error('Error fetching Instagram posts:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return <Skeleton />
  }

  if (error) {
    return <ErrorState onRetry={fetchPosts} />
  }

  if (posts.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {posts.map((post, index) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square overflow-hidden bg-gray-100 animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Image */}
          <Image
            src={post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url}
            alt={post.caption?.slice(0, 100) || 'Instagram post'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Media type indicator */}
          {post.media_type === 'VIDEO' && (
            <div className="absolute top-3 right-3 z-10">
              <PlayIcon className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          )}
          {post.media_type === 'CAROUSEL_ALBUM' && (
            <div className="absolute top-3 right-3 z-10">
              <CarouselIcon className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
              <InstagramIcon className="w-8 h-8 text-white mx-auto mb-2" />
              {post.caption && (
                <p className="text-white text-sm line-clamp-3 leading-relaxed">
                  {post.caption.slice(0, 100)}
                  {post.caption.length > 100 && '...'}
                </p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
