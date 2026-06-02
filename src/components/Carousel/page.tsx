import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useMemo, useRef } from 'react'
import type { Filme } from '../../types/filme'
import { Card } from '../Card/page'

type CarrosselProps = {
  filmes: Filme[]
  filmeAtual: Filme
  onSelectFilme: (filme: Filme) => void
  onOpenDetails: (filme: Filme) => void
}

export function Carrossel({ filmes, filmeAtual, onSelectFilme, onOpenDetails }: CarrosselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null)

  const getFilmeKey = (filme: Filme) => `${filme.mediaType ?? 'movie'}:${filme.id}`

  const filmesEmDestaque = useMemo(() => {
    return [...filmes]
      .filter((f) => f.mediaType !== 'tv')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
  }, [filmes])

  const scrollLeft = () => {
    if (!carouselRef.current) return
    const cardWidth = carouselRef.current.querySelector('div')?.clientWidth || 0
    carouselRef.current.scrollBy({ left: -(cardWidth + 12), behavior: 'smooth' })
  }

  const scrollRight = () => {
    if (!carouselRef.current) return
    const cardWidth = carouselRef.current.querySelector('div')?.clientWidth || 0
    carouselRef.current.scrollBy({ left: cardWidth + 12, behavior: 'smooth' })
  }

  return (
    <>
      <h3 className="px-8 md:px-10 pb-10 sm:pb-5 flex max-w-7xl mx-auto text-lg font-semibold">
        Filmes em destaque
      </h3>

      <main className="relative z-20 mx-auto -mt-6 md:-mt-2 max-w-7xl px-5 pb-10">
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 hide-scrollbar px-1 md:px-2"
          >
            {filmesEmDestaque.map((filme) => {
              const ativo = getFilmeKey(filme) === getFilmeKey(filmeAtual)

              return (
                <div
                  key={getFilmeKey(filme)}
                  onClick={() => {
                    onSelectFilme(filme)
                    onOpenDetails(filme)
                  }}
                  className={`
                    min-w-[48%] sm:min-w-[31%] md:min-w-[23%] lg:min-w-[19.2%]
                    flex-shrink-0 transition-all duration-300 cursor-pointer
                    ${ativo ? 'scale-105 -translate-y-2 text-purple-300 font-medium' : 'opacity-70 hover:opacity-100'}
                  `}
                >
                  <Card {...filme} />
                </div>
              )
            })}
          </div>
        </div>

        <div id="card-buttons" className="flex gap-2 justify-end mt-4">
          <button
            onClick={scrollLeft}
            className="rounded-full border border-white/20 bg-white/5 p-3 text-white backdrop-blur-md transition hover:bg-white/10 hover:text-purple-500 hover:border-purple-500 cursor-pointer"
          >
            <CaretLeftIcon weight="bold" />
          </button>
          <button
            onClick={scrollRight}
            className="rounded-full border border-white/20 bg-white/5 p-3 text-white backdrop-blur-md transition hover:bg-white/10 hover:text-purple-500 hover:border-purple-500 cursor-pointer"
          >
            <CaretRightIcon weight="bold" />
          </button>
        </div>
      </main>
    </>
  )
}
