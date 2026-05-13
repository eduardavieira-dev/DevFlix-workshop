import { StarIcon } from '@phosphor-icons/react'
import type { Filme } from '../../types/filme'

type BannerProps = {
  filme: Filme
  onOpenDetails: (filme: Filme) => void
}

export function Banner({ filme, onOpenDetails }: BannerProps) {
  return (
    <>
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
        className="w-full flex flex-col gap-2 text-left cursor-pointer"
      >
        <div className="relative w-full">
          <div className="aspect-[2/3] w-full overflow-hidden rounded-md">
            <img src={filme.imageUrl} alt={filme.title} className="h-full w-full object-cover" />
          </div>
        </div>
        <h3 className="text-md font-medium line-clamp-1">{filme.title}</h3>
        <div className="text-xs flex items-center gap-2 justify-between text-neutral-300">
          <span>{filme.year}</span>
          <span className="flex items-center gap-1">
            <StarIcon weight="fill" className="text-amber-400" /> {filme.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </>
  )
}
