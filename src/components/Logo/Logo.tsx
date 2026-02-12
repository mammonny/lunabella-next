import clsx from 'clsx'
import Image from 'next/image'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className, loading = 'eager', priority = 'high' } = props

  return (
    <Image
      src="/logo-lunabella-s.png"
      alt="LunaBella - Criadores de Golden Retriever"
      width={180}
      height={60}
      className={clsx('h-10 w-auto shrink-0', className)}
      loading={loading}
      priority={priority === 'high'}
    />
  )
}
