import Link from 'next/link'

type BreadcrumbItem = {
  label: string
  href?: string
}

export function PageBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 lg:px-12 py-3">
        <nav
          className="flex items-center gap-2 text-sm text-gray-500"
          aria-label="Migas de pan"
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-300">/</span>}
                {isLast || !item.href ? (
                  <span className="text-gray-900">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#a58a1b] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </span>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
