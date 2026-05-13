import { FilmSlateIcon, InfoIcon, PlayIcon, StarIcon } from '@phosphor-icons/react'
import type { Filme } from '../../types/filme'

type BackgroundProps = {
  filme: Filme
  onOpenDetails: (filme: Filme) => void
}

export function Background({ filme, onOpenDetails }: BackgroundProps) {
  return (
    <section className="relative h-[65vh] md:h-[70vh] lg:h-[85vh] w-full overflow-hidden">
      <img
        src={filme.bannerUrl}
        alt={filme.title}
        className="absolute inset-0 w-full object-contain md:object-cover md:object-top md:h-full"
      />

      <div className="absolute inset-0 bg-black/60 md:bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/100 md:via-background/60 to-black/10" />

      <h2 className="absolute top-6 left-6 md:left-30 z-20 flex items-center gap-2 text-xl md:text-2xl font-semibold">
        <FilmSlateIcon size={24} className="text-cyan-400" />
        <span>
          Dev<span className="text-cyan-400">Flix</span>
        </span>
      </h2>

      <div className="relative z-10 flex h-full items-end md:left-20">
        <div className="max-w-xl px-6 md:px-10 pb-16 md:pb-24">
          <h1 className="mb-4 text-4xl md:text-6xl font-bold">{filme.title}</h1>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-neutral-300">
            <span className="flex items-center gap-1">
              <StarIcon weight="fill" className="text-amber-400" /> {filme.rating.toFixed(1)}
            </span>
            <span>{filme.year}</span>
            <span>{filme.duration}</span>
            <span>{filme.genres}</span>
          </div>

          <p className="mb-6 max-w-lg leading-relaxed line-clamp-4 text-neutral-200">
            {filme.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href={filme.watchUrl !== '#' ? filme.watchUrl : undefined}
              target={filme.watchUrl !== '#' ? '_blank' : undefined}
              rel={filme.watchUrl !== '#' ? 'noreferrer' : undefined}
              aria-disabled={filme.watchUrl === '#'}
              className="text-sm md:text-md rounded-full bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 cursor-pointer flex items-center gap-1"
            >
              <PlayIcon weight="fill" /> Assistir
            </a>

            <button
              onClick={() => onOpenDetails(filme)}
              className="text-sm md:text-md rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10 cursor-pointer flex items-center gap-1"
            >
              <InfoIcon size={18} />
              Mais informações
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
