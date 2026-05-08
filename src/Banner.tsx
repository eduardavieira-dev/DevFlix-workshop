import { Heart, StarIcon } from '@phosphor-icons/react'
import { useState } from 'react'

export function Banner() {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <>
      <a href="" className="w-full flex flex-col gap-2">
        <div className="relative">
          <img src="banner.png" alt="" className="w-full object-cover rounded-md" />
          <button
            aria-label="Favoritar"
            onClick={(e) => {
              e.preventDefault()
              setIsFavorited(!isFavorited)
            }}
            className="absolute top-2 right-2 bg-white/10 text-white p-2 rounded-full border border-white/30 backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
          >
            <Heart
              weight={isFavorited ? 'fill' : 'regular'}
              color={isFavorited ? '#ef4444' : '#ffffff'}
            />
          </button>
        </div>
        <h3 className="text-md font-medium">Titulo filme/série</h3>
        <div className="text-xs flex items-center gap-2 justify-between text-neutral-300">
          <span>2026</span>
          <span className="flex items-center gap-1">
            <StarIcon weight="fill" className="text-amber-400" /> 7.0
          </span>
        </div>
      </a>
    </>
  )
}
