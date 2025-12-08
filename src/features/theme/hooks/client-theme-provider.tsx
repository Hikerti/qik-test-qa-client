'use client'

import { useEffect, ReactNode } from 'react'
import { useUIStore } from '@state'
import { UserTheme, UserDTO, updateAuthorizedUser } from '@entities'

interface ClientThemeProviderProps {
  children: ReactNode
  user?: any
}

export const ClientThemeProvider = ({ children, user }: ClientThemeProviderProps) => {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      if (user?.theme === UserTheme.dark || user?.theme === UserTheme.light) {
        setTheme(user.theme)
        return
      }

      const localTheme = localStorage.getItem('theme')
      if (localTheme === UserTheme.light || localTheme === UserTheme.dark) {
        setTheme(localTheme)
      }
    } catch (err) {
      console.warn('Error reading theme', err)
    }
  }, [setTheme, user])

  useEffect(() => {
    if (typeof window === 'undefined' || !theme) return

    try {
      localStorage.setItem('theme', theme)

      const root = document.documentElement
      root.classList.toggle('dark', theme === UserTheme.dark)

      if (user) {
        updateAuthorizedUser({
          method: 'PUT',
          body: { theme },
        }).catch((err) => console.warn('Failed to update user theme', err))
      }
    } catch (err) {
      console.warn('Error updating theme', err)
    }
  }, [theme, user])

  return children
}
