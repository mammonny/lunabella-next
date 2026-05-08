'use client'

import * as React from 'react'
import {
  Check,
  Globe,
  History,
  Info,
  Languages,
  Settings2,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react'
import { Flag, type FlagCode } from './Flag'

type Lang = {
  code: FlagCode
  label: string
  native?: string
}

const TARGETS: Lang[] = [
  { code: 'ca', label: 'Catalán', native: 'Català' },
  { code: 'eu', label: 'Euskera', native: 'Euskara' },
  { code: 'en', label: 'Inglés', native: 'English' },
  { code: 'fr', label: 'Francés', native: 'Français' },
]

const COVERAGE = [
  { slug: 'pages', label: 'Páginas', count: 12, pct: 0, tone: 'idle' as const },
  { slug: 'posts', label: 'Publicaciones', count: 18, pct: 0, tone: 'idle' as const },
  { slug: 'dogs', label: 'Ejemplares', count: 24, pct: 0, tone: 'idle' as const },
  { slug: 'puppies', label: 'Cachorros', count: 8, pct: 0, tone: 'idle' as const },
  { slug: 'breeds', label: 'Razas', count: 4, pct: 0, tone: 'idle' as const },
  { slug: 'litters', label: 'Camadas', count: 6, pct: 0, tone: 'idle' as const },
]

const HISTORY: { id: number; title: string; target: string; when: string; items: number }[] = []

export function TranslateMockup() {
  const [selected, setSelected] = React.useState<FlagCode[]>(['ca', 'en'])
  const [tone, setTone] = React.useState('profesional')
  const [keepFormat, setKeepFormat] = React.useState(true)
  const [overwrite, setOverwrite] = React.useState(false)
  const [glossary, setGlossary] = React.useState(
    'LunaBella, Dogo Argentino, pedigree, palmarés',
  )
  const [notice, setNotice] = React.useState(false)

  const toggle = (code: FlagCode) =>
    setSelected((cur) => (cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code]))

  const totalItems = COVERAGE.reduce((acc, c) => acc + c.count, 0)
  const avgPct = Math.round(COVERAGE.reduce((a, c) => a + c.pct, 0) / COVERAGE.length)

  return (
    <div className="lbt-page">
      {/* HEADER */}
      <header className="lbt-mast">
        <div className="lbt-mast__eyebrow">
          <Globe size={12} strokeWidth={1.5} />
          <span>Internacionalización</span>
          <span className="lbt-mast__bullet" aria-hidden>
            ◆
          </span>
          <span>Beta</span>
        </div>
        <h1 className="lbt-mast__title">
          Traducir <em>el sitio</em>
        </h1>
        <p className="lbt-mast__lede">
          Genera versiones del contenido en otros idiomas con un solo clic. Los cambios se sincronizan
          con cada colección manteniendo el formato original.
        </p>
        <div className="lbt-mast__stats">
          <div className="lbt-stat">
            <span className="lbt-stat__num">{totalItems}</span>
            <span className="lbt-stat__lbl">elementos</span>
          </div>
          <div className="lbt-stat">
            <span className="lbt-stat__num">{TARGETS.length}</span>
            <span className="lbt-stat__lbl">idiomas disponibles</span>
          </div>
          <div className="lbt-stat">
            <span className="lbt-stat__num">{avgPct}%</span>
            <span className="lbt-stat__lbl">cobertura media</span>
          </div>
        </div>
      </header>

      <div className="lbt-grid">
        {/* MAIN */}
        <div className="lbt-main">
          {/* LANGUAGES */}
          <section className="lbt-card">
            <div className="lbt-card__head">
              <Languages size={16} strokeWidth={1.5} />
              <h2>Idiomas</h2>
              <span className="lbt-card__hint">
                {selected.length} seleccionado{selected.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="lbt-source">
              <span className="lbt-source__lbl">Origen</span>
              <div className="lbt-source__chip">
                <Flag code="es" size={26} />
                <span className="lbt-source__name">Español</span>
                <span className="lbt-source__lock">FIJADO</span>
              </div>
            </div>

            <div className="lbt-langs">
              {TARGETS.map((l) => {
                const on = selected.includes(l.code)
                return (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => toggle(l.code)}
                    className={`lbt-lang${on ? ' lbt-lang--on' : ''}`}
                    aria-pressed={on}
                  >
                    <Flag code={l.code} size={28} />
                    <span className="lbt-lang__body">
                      <span className="lbt-lang__name">{l.label}</span>
                      <span className="lbt-lang__native">{l.native}</span>
                    </span>
                    <span className="lbt-lang__check" aria-hidden>
                      {on ? <Check size={14} strokeWidth={2} /> : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="lbt-cta">
            <div className="lbt-cta__body">
              <h3>Listo para empezar</h3>
              <p>
                Vas a traducir <strong>{totalItems}</strong> elementos a{' '}
                <strong>
                  {selected.length} idioma{selected.length === 1 ? '' : 's'}
                </strong>
                . El proceso puede tardar unos minutos.
              </p>
            </div>
            <button
              type="button"
              className="lbt-btn lbt-btn--primary"
              onClick={() => setNotice(true)}
              disabled={selected.length === 0}
            >
              <Wand2 size={16} strokeWidth={1.75} />
              Traducir todo el sitio
            </button>
          </section>

          {/* COVERAGE */}
          <section className="lbt-card">
            <div className="lbt-card__head">
              <Sparkles size={16} strokeWidth={1.5} />
              <h2>Estado de traducción</h2>
              <span className="lbt-card__hint">por colección</span>
            </div>

            <ul className="lbt-cov">
              {COVERAGE.map((c) => (
                <li key={c.slug} className="lbt-cov__row">
                  <div className="lbt-cov__head">
                    <span className="lbt-cov__name">{c.label}</span>
                    <span className="lbt-cov__count">
                      {c.count} elementos · {c.pct}%
                    </span>
                  </div>
                  <div className="lbt-cov__bar">
                    <span
                      className={`lbt-cov__fill lbt-cov__fill--${c.tone}`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* SETTINGS */}
          <section className="lbt-card">
            <div className="lbt-card__head">
              <Settings2 size={16} strokeWidth={1.5} />
              <h2>Configuración</h2>
              <span className="lbt-card__hint">avanzado</span>
            </div>

            <div className="lbt-form">
              <label className="lbt-field">
                <span className="lbt-field__lbl">Tono de la traducción</span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="lbt-field__select"
                >
                  <option value="profesional">Profesional · cría especializada</option>
                  <option value="cercano">Cercano · familiar</option>
                  <option value="comercial">Comercial · orientado a venta</option>
                  <option value="literario">Literario · editorial</option>
                </select>
              </label>

              <label className="lbt-field">
                <span className="lbt-field__lbl">
                  Glosario de términos
                  <span className="lbt-field__hint">se respetan tal cual</span>
                </span>
                <textarea
                  value={glossary}
                  onChange={(e) => setGlossary(e.target.value)}
                  rows={3}
                  className="lbt-field__textarea"
                  placeholder="Nombres propios, términos de raza, palabras a no traducir..."
                />
              </label>

              <div className="lbt-toggles">
                <label className="lbt-toggle">
                  <input
                    type="checkbox"
                    checked={keepFormat}
                    onChange={(e) => setKeepFormat(e.target.checked)}
                  />
                  <span className="lbt-toggle__track" aria-hidden>
                    <span className="lbt-toggle__thumb" />
                  </span>
                  <span className="lbt-toggle__body">
                    <span className="lbt-toggle__lbl">Mantener formato Lexical</span>
                    <span className="lbt-toggle__hint">Conserva títulos, listas y enlaces</span>
                  </span>
                </label>

                <label className="lbt-toggle">
                  <input
                    type="checkbox"
                    checked={overwrite}
                    onChange={(e) => setOverwrite(e.target.checked)}
                  />
                  <span className="lbt-toggle__track" aria-hidden>
                    <span className="lbt-toggle__thumb" />
                  </span>
                  <span className="lbt-toggle__body">
                    <span className="lbt-toggle__lbl">Sobrescribir traducciones existentes</span>
                    <span className="lbt-toggle__hint">
                      Reemplaza los textos ya traducidos manualmente
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* ASIDE */}
        <aside className="lbt-aside">
          <section className="lbt-card lbt-card--aside">
            <div className="lbt-card__head">
              <History size={16} strokeWidth={1.5} />
              <h2>Última actividad</h2>
            </div>
            {HISTORY.length === 0 ? (
              <div className="lbt-empty">
                <div className="lbt-empty__dot" aria-hidden />
                <p className="lbt-empty__title">Sin actividad todavía</p>
                <p className="lbt-empty__hint">
                  Aquí aparecerán las traducciones que vayas generando.
                </p>
              </div>
            ) : (
              <ul className="lbt-hist">
                {HISTORY.map((h) => (
                  <li key={h.id} className="lbt-hist__row">
                    <div className="lbt-hist__top">
                      <span className="lbt-hist__title">{h.title}</span>
                      <span className="lbt-hist__target">{h.target}</span>
                    </div>
                    <div className="lbt-hist__meta">
                      <span>{h.when}</span>
                      <span aria-hidden>·</span>
                      <span>
                        {h.items} traducido{h.items === 1 ? '' : 's'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="lbt-card lbt-card--aside lbt-card--soft">
            <div className="lbt-soft">
              <Info size={16} strokeWidth={1.5} />
              <div>
                <h3>¿Cómo funciona?</h3>
                <p>
                  La traducción usa el contenido publicado de cada colección y crea una versión por
                  idioma respetando los bloques del editor. Puedes revisar cada texto antes de
                  publicarlo.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* NOTICE MODAL */}
      {notice && (
        <div
          className="lbt-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lbt-modal-title"
          onClick={() => setNotice(false)}
        >
          <div className="lbt-modal__panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lbt-modal__close"
              onClick={() => setNotice(false)}
              aria-label="Cerrar"
            >
              <X size={16} strokeWidth={1.75} />
            </button>
            <div className="lbt-modal__icon">
              <Sparkles size={20} strokeWidth={1.5} />
            </div>
            <h3 id="lbt-modal-title">Vista previa de la función</h3>
            <p>
              La traducción automática <strong>aún no está activada</strong> en este sitio. Cuando
              lo esté, podrás traducir todo el contenido a los idiomas seleccionados desde aquí.
            </p>
            <p className="lbt-modal__small">
              Habla con el equipo técnico para activarla cuando estés lista.
            </p>
            <button
              type="button"
              className="lbt-btn lbt-btn--primary lbt-btn--full"
              onClick={() => setNotice(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
