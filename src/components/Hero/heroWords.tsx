import React from 'react'

// Divide un título JSX en palabras enmascaradas para el reveal escalonado de
// los heros. Conserva las clases de los spans anidados (p. ej. degradado
// dorado) aplicándolas a cada palabra, y respeta elementos sin texto (<br />).
export function renderHeroWords(
  node: React.ReactNode,
  counter: { i: number } = { i: 0 },
  wordClass = '',
): React.ReactNode {
  if (node == null || typeof node === 'boolean') return null

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => {
        const i = counter.i++
        return (
          <React.Fragment key={i}>
            <span className="hero-word-mask">
              <span
                className={`hero-word ${wordClass}`.trim()}
                style={{ '--wr-i': i } as React.CSSProperties}
              >
                {word}
              </span>
            </span>{' '}
          </React.Fragment>
        )
      })
  }

  if (Array.isArray(node)) {
    return node.map((child, idx) => (
      <React.Fragment key={idx}>{renderHeroWords(child, counter, wordClass)}</React.Fragment>
    ))
  }

  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode; className?: string }
    if (props.children == null) return node
    return renderHeroWords(props.children, counter, props.className ?? wordClass)
  }

  return node
}
