import React from 'react'
import { ChevronRight } from 'lucide-react'

type BreadcrumbItem = {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={`flex text-sm ${className || ''}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {/* Añadir separador ChevronRight entre elementos */}
            {index > 0 && (
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </li>
            )}

            {/* Elemento de breadcrumb */}
            <li className={index === items.length - 1 ? 'text-foreground font-medium' : ''}>
              {item.href && index !== items.length - 1 ? (
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground flex items-center"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span
                  className="flex items-center"
                  aria-current={index === items.length - 1 ? 'page' : undefined}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
