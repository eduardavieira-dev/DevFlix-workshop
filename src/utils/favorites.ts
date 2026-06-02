import type { Filme } from '../types/filme'

const FAVORITES_KEY = 'devflix:favorites'
export const FAVORITES_UPDATED_EVENT = 'devflix:favorites-updated'

function notifyFavoritesUpdated() {
  window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT))
}

function isFilme(value: unknown): value is Filme {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as Filme).id === 'number'
  )
}

function normalizeFavorites(value: unknown): Filme[] {
  if (Array.isArray(value)) {
    return value.filter(isFilme)
  }

  if (isFilme(value)) {
    return [value]
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'favorites' in value &&
    Array.isArray((value as { favorites?: unknown }).favorites)
  ) {
    return (value as { favorites: unknown[] }).favorites.filter(isFilme)
  }

  return []
}

export function getFavorites(): Filme[] {
  const data = localStorage.getItem(FAVORITES_KEY)

  if (!data) return []

  try {
    const parsed = JSON.parse(data)
    const favorites = normalizeFavorites(parsed)

    if (!Array.isArray(parsed) || favorites.length !== parsed.length) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }

    return favorites
  } catch {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([]))
    return []
  }
}

export function isFavorite(movieId: number) {
  return getFavorites().some((movie) => movie.id === movieId)
}

export function toggleFavorite(movie: Filme) {
  const favorites = getFavorites()

  const alreadyExists = favorites.some(
    (fav) => fav.id === movie.id,
  )

  if (alreadyExists) {
    const updated = favorites.filter(
      (fav) => fav.id !== movie.id,
    )

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updated),
    )

    notifyFavoritesUpdated()

    return false
  }

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify([...favorites, movie]),
  )

  notifyFavoritesUpdated()

  return true
}