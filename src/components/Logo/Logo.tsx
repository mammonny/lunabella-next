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
      src="/logo-lunabella.png"
      alt="LunaBella - Criadores de Golden Retriever"
      width={562}
      height={152}
      sizes="160px"
      className={clsx('h-9 w-auto shrink-0 md:h-10', className)}
      loading={loading}
      priority={priority === 'high'}
    />
  )
}
