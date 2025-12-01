import { clsx } from 'clsx'

export function Gradient({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className)}
      style={{
        background: 'linear-gradient(115deg, #ffffff 20%, #f0918ede 70%, #f0918e 100%)',
      }}
    />
  )
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-[36rem] transform-gpu md:right-0',
          'from-[#fffff] via-[#ee87cb] to-[#b060ff]',
          'rotate-[-10deg] rounded-full blur-3xl',
          'gradient-115',
        )}
      />
    </div>
  )
}

export function GradientBackgroundTestimonials() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -left-60 h-60 w-[36rem] transform-gpu md:right-0 -z-10',
          'bg-gradient-to-br from-[#fffffc93] via-[#ee87cc4f] to-#f0918e',
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}
