'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((themeToSet: Theme | null) => {
    // Siempre establecer el tema en 'light', ignorando el parámetro themeToSet
    const forcedTheme: Theme = 'light'
    setThemeState(forcedTheme)
    window.localStorage.setItem(themeLocalStorageKey, forcedTheme)
    document.documentElement.setAttribute('data-theme', forcedTheme)
  }, [])

  useEffect(() => {
    // Siempre inicializar el tema en 'light', ignorando cualquier preferencia
    const forcedTheme: Theme = 'light'
    document.documentElement.setAttribute('data-theme', forcedTheme)
    setThemeState(forcedTheme)
    window.localStorage.setItem(themeLocalStorageKey, forcedTheme)
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
