import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Logo GoizAmetz"
      width={250}
      height={55}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[12.375rem] w-full h-[75px]', className)}
      src="/logo-goiz.png" // Consider changing this image if needed
    />
  )
}
