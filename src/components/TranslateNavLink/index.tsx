'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Languages } from 'lucide-react'
import './index.scss'

export default function TranslateNavLink() {
  const pathname = usePathname() ?? ''
  const active = pathname.startsWith('/admin/translate')

  return (
    <Link
      href="/admin/translate"
      className={`lbt-navlink${active ? ' lbt-navlink--active' : ''}`}
    >
      <Languages size={16} strokeWidth={1.5} className="lbt-navlink__icon" />
      <span className="lbt-navlink__label">Traducir sitio</span>
    </Link>
  )
}
