'use client'

import * as React from 'react'

type Code = 'es' | 'ca' | 'eu' | 'en' | 'fr'

const VB = '0 0 30 20'

function FlagES() {
  return (
    <svg viewBox={VB} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </svg>
  )
}

function FlagCA() {
  // Senyera: 9 horizontal stripes, 5 yellow + 4 red.
  const stripe = 20 / 9
  return (
    <svg viewBox={VB} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="30" height="20" fill="#fcdd09" />
      {[1, 3, 5, 7].map((i) => (
        <rect key={i} y={stripe * i} width="30" height={stripe} fill="#da121a" />
      ))}
    </svg>
  )
}

function FlagEU() {
  // Ikurriña: red field, green saltire, white Greek cross over the saltire.
  return (
    <svg viewBox={VB} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="30" height="20" fill="#d52b1e" />
      <g strokeLinecap="butt">
        <line x1="-1" y1="-1" x2="31" y2="21" stroke="#009b48" strokeWidth="3" />
        <line x1="-1" y1="21" x2="31" y2="-1" stroke="#009b48" strokeWidth="3" />
        <line x1="0" y1="10" x2="30" y2="10" stroke="#fff" strokeWidth="3.2" />
        <line x1="15" y1="0" x2="15" y2="20" stroke="#fff" strokeWidth="3.2" />
      </g>
    </svg>
  )
}

function FlagFR() {
  return (
    <svg viewBox={VB} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="10" height="20" fill="#0055a4" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ef4135" />
    </svg>
  )
}

function FlagGB() {
  // Simplified Union Jack: blue field, white saltire, red saltire (no offset),
  // white plus, red plus on top.
  return (
    <svg
      viewBox={VB}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="none"
    >
      <rect width="30" height="20" fill="#012169" />
      <g>
        <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="4" />
        <path d="M0,0 L30,20 M30,0 L0,20" stroke="#c8102e" strokeWidth="1.6" />
      </g>
      <rect x="12" width="6" height="20" fill="#fff" />
      <rect y="7" width="30" height="6" fill="#fff" />
      <rect x="13.5" width="3" height="20" fill="#c8102e" />
      <rect y="8.5" width="30" height="3" fill="#c8102e" />
    </svg>
  )
}

const REGISTRY: Record<Code, React.ComponentType> = {
  es: FlagES,
  ca: FlagCA,
  eu: FlagEU,
  en: FlagGB,
  fr: FlagFR,
}

export function Flag({ code, size = 22 }: { code: Code; size?: number }) {
  const Cmp = REGISTRY[code]
  if (!Cmp) return null
  return (
    <span
      className="lbt-flag"
      style={{ width: size, height: size * (20 / 30) }}
      aria-hidden
    >
      <Cmp />
    </span>
  )
}

export type FlagCode = Code
