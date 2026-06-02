import { HeartIcon, StarIcon } from '@phosphor-icons/react'

import { useEffect, useState } from 'react'

import type { Filme } from '../../types/filme'

import { FAVORITES_UPDATED_EVENT, isFavorite, toggleFavorite } from '../../utils/favorites'

type BannerProps = {
  filme: Filme
  onOpenDetails: (filme: Filme) => void
}

export function Banner({ filme, onOpenDetails }: BannerProps) {
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    setFavorite(isFavorite(filme.id))
  }, [filme.id])

  useEffect(() => {
    function syncFavoriteState() {
      setFavorite(isFavorite(filme.id))
    }

    window.addEventListener(FAVORITES_UPDATED_EVENT, syncFavoriteState)
    window.addEventListener('storage', syncFavoriteState)

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, syncFavoriteState)
      window.removeEventListener('storage', syncFavoriteState)
    }
  }, [filme.id])

  function handleFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()

    const updated = toggleFavorite(filme)

    setFavorite(updated)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(filme)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()

          onOpenDetails(filme)
        }
      }}
      className="group flex w-full cursor-pointer flex-col gap-2 text-left"
    >
      <div className="relative w-full overflow-hidden rounded-xl">
        <div className="aspect-[2/3] w-full">
          <img
            src={filme.imageUrl}
            alt={filme.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <button
          type="button"
          onClick={handleFavorite}
          className={`
            absolute right-3 top-3 z-20
            flex h-10 w-10 items-center justify-center
            rounded-full border
            backdrop-blur-md
            transition-all duration-300
            hover:scale-110 cursor-pointer

            ${
              favorite
                ? 'border-red-500/40 bg-red-600/30 text-red-500'
                : 'border-white/20 bg-black/30 text-white hover:bg-black/50'
            }
          `}
        >
          <HeartIcon size={18} weight={favorite ? 'fill' : 'regular'} />
        </button>
      </div>

      <h3 className="line-clamp-1 text-sm font-medium text-white">{filme.title}</h3>

      <div className="flex items-center justify-between text-xs text-neutral-300">
        <span>{filme.year}</span>

        <span className="flex items-center gap-1">
          <StarIcon weight="fill" className="text-amber-400" />

          {filme.rating.toFixed(1)}
        </span>
      </div>
    </div>
  )
}
