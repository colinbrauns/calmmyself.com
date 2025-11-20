"use client"

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'calmmyself:favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavorites(parsed.filter((id) => typeof id === 'string'))
        }
      }
    } catch {
      // Fail silently – favorites are a convenience feature only
    }
  }, [])

  // Persist favorites whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Ignore quota / private mode errors – app still works without persistence
    }
  }, [favorites])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    )
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  )

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  }
}


