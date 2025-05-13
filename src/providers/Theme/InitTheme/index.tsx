import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    // Forzar siempre el tema claro, ignorando cualquier preferencia
    var forcedTheme = 'light'

    // Establecer el tema forzado en localStorage y en el atributo data-theme
    window.localStorage.setItem('${themeLocalStorageKey}', forcedTheme)
    document.documentElement.setAttribute('data-theme', forcedTheme)
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
