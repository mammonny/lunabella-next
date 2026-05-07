import type { ServerProps } from 'payload'
import Link from 'next/link'
import {
  ArrowUpRight,
  Dog,
  Heart,
  Images,
  LayoutTemplate,
  Newspaper,
  PanelBottomOpen,
  PanelTopOpen,
  PawPrint,
  SlidersHorizontal,
  Trophy,
} from 'lucide-react'

import './index.scss'

type Entity = {
  slug: string
  label: string
  desc: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}

const FEATURED: Entity[] = [
  { slug: 'ejemplares', label: 'Ejemplares', desc: 'Adultos del programa de cría', icon: Dog },
  { slug: 'cachorros', label: 'Cachorros', desc: 'Camada actual y reservas', icon: PawPrint },
]

const SECONDARY: Entity[] = [
  { slug: 'paginas', label: 'Páginas', desc: 'Estructura del sitio', icon: LayoutTemplate },
  {
    slug: 'publicaciones',
    label: 'Publicaciones',
    desc: 'Notas y entradas del blog',
    icon: Newspaper,
  },
  { slug: 'camadas', label: 'Camadas', desc: 'Histórico de cría', icon: Heart },
  { slug: 'exposiciones', label: 'Exposiciones', desc: 'Logros y palmarés', icon: Trophy },
]

const WIDE: Entity[] = [
  { slug: 'media', label: 'Archivos', desc: 'Biblioteca de imágenes y documentos', icon: Images },
]

const GLOBALS: { slug: string; label: string; icon: Entity['icon'] }[] = [
  { slug: 'header', label: 'Encabezado', icon: PanelTopOpen },
  { slug: 'footer', label: 'Pie de Página', icon: PanelBottomOpen },
  { slug: 'site-settings', label: 'Configuración', icon: SlidersHorizontal },
]

export default async function LunaBellaDashboard(props: ServerProps) {
  const { user } = props

  const u = user as { name?: string | null; email?: string | null } | null | undefined
  const firstName =
    (u?.name && u.name.trim().split(/\s+/)[0]) ||
    (u?.email && u.email.split('@')[0]) ||
    'Lunabella'

  return (
    <div className="lb-dashboard">
      <header className="lb-mast">
        <div className="lb-mast__eyebrow">
          <span>Panel privado</span>
          <span className="lb-mast__bullet" aria-hidden>
            ◆
          </span>
          <span>lunabella.es</span>
        </div>
        <h1 className="lb-mast__title">
          Hola, <em>{firstName}</em>.
        </h1>
        <p className="lb-mast__lede">
          Todo el contenido del sitio en un solo lugar. Cuida de los ejemplares y mantén el sitio
          siempre vivo.
        </p>
      </header>

      <section className="lb-section">
        <div className="lb-section__head">
          <h2 className="lb-section__title">Contenido principal</h2>
          <span className="lb-section__rule" aria-hidden />
        </div>

        <div className="lb-grid lb-grid--feature">
          {FEATURED.map((e) => {
            const Icon = e.icon
            return (
              <Link
                key={e.slug}
                href={`/admin/collections/${e.slug}`}
                className="lb-card lb-card--feature"
              >
                <div className="lb-card__head">
                  <Icon className="lb-card__icon" strokeWidth={1.25} />
                </div>
                <div className="lb-card__body">
                  <h3 className="lb-card__label">{e.label}</h3>
                  <p className="lb-card__desc">{e.desc}</p>
                </div>
                <div className="lb-card__cta">
                  <span>Gestionar colección</span>
                  <ArrowUpRight className="lb-card__arrow" strokeWidth={1.25} />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="lb-grid lb-grid--quad">
          {SECONDARY.map((e) => {
            const Icon = e.icon
            return (
              <Link key={e.slug} href={`/admin/collections/${e.slug}`} className="lb-card">
                <div className="lb-card__head">
                  <Icon className="lb-card__icon" strokeWidth={1.25} />
                </div>
                <div className="lb-card__body">
                  <h3 className="lb-card__label">{e.label}</h3>
                  <p className="lb-card__desc">{e.desc}</p>
                </div>
                <div className="lb-card__cta">
                  <span>Abrir</span>
                  <ArrowUpRight className="lb-card__arrow" strokeWidth={1.25} />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="lb-grid lb-grid--wide">
          {WIDE.map((e) => {
            const Icon = e.icon
            return (
              <Link
                key={e.slug}
                href={`/admin/collections/${e.slug}`}
                className="lb-card lb-card--wide"
              >
                <div className="lb-card__wide">
                  <Icon className="lb-card__icon" strokeWidth={1.25} />
                  <div className="lb-card__wide-body">
                    <h3 className="lb-card__label">{e.label}</h3>
                    <p className="lb-card__desc">{e.desc}</p>
                  </div>
                  <div className="lb-card__cta lb-card__cta--inline">
                    <span>Abrir biblioteca</span>
                    <ArrowUpRight className="lb-card__arrow" strokeWidth={1.25} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="lb-section">
        <div className="lb-section__head">
          <h2 className="lb-section__title">Ajustes del sitio</h2>
          <span className="lb-section__rule" aria-hidden />
        </div>

        <div className="lb-grid lb-grid--triad">
          {GLOBALS.map((g) => {
            const Icon = g.icon
            return (
              <Link key={g.slug} href={`/admin/globals/${g.slug}`} className="lb-tile">
                <Icon className="lb-tile__icon" strokeWidth={1.25} />
                <span className="lb-tile__label">{g.label}</span>
                <ArrowUpRight className="lb-tile__arrow" strokeWidth={1.25} />
              </Link>
            )
          })}
        </div>
      </section>

      <footer className="lb-foot">
        <span>LunaBella</span>
        <span aria-hidden className="lb-foot__sep">
          ·
        </span>
        <span>Panel administrativo</span>
        <span aria-hidden className="lb-foot__sep">
          ·
        </span>
        <span>Cría golden retriever</span>
      </footer>
    </div>
  )
}
