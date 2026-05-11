import { CaretLeftIcon, CaretRightIcon, PlayIcon, StarIcon, XIcon } from '@phosphor-icons/react'

import { useRef } from 'react'
import type { Filme } from '../types/filme'

type ModalProps = {
  filme: Filme

  fecharModal: () => void
}

export function Modal({ filme, fecharModal }: ModalProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  function scrollLeft() {
    carouselRef.current?.scrollBy({
      left: -300,
      behavior: 'smooth',
    })
  }

  function scrollRight() {
    carouselRef.current?.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/80
        backdrop-blur-sm

        overflow-y-auto
        p-2
        md:p-6
      "
    >
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-5xl

          rounded-3xl
          border
          border-white/10
          bg-background

          overflow-hidden
        "
      >
        {/* banner */}
        <div
          className="
            relative

            min-h-[500px]
            md:min-h-[430px]
          "
        >
          <img
            src={filme.bannerUrl}
            alt={filme.title}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/1200x700/202020/FFFFFF?text=Sem+Banner'
            }}
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* degradê */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />

          {/* fechar */}
          <button
            onClick={fecharModal}
            className="
              absolute
              right-3
              top-3
              z-50

              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-full
              bg-black/60
              text-white

              transition
              hover:bg-black
            "
          >
            <XIcon size={20} />
          </button>

          {/* conteúdo */}
          <div
            className="
              relative
              z-20

              flex
              flex-col
              md:flex-row

              gap-5

              p-4
              md:p-8

              pt-16
              md:pt-24
            "
          >
            {/* poster */}
            <div
              className="
                mx-auto
                md:mx-0

                w-[180px]
                sm:w-[220px]
                md:w-[190px]

                flex-shrink-0
              "
            >
              <img
                src={filme.imageUrl}
                alt={filme.title}
                className="
                  w-full
                  rounded-2xl
                  object-cover
                  border
                  border-white/10
                  shadow-2xl
                "
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/300x450/404040/FFFFFF?text=Sem+Imagem'
                }}
              />
            </div>

            {/* infos */}
            <div className="flex-1">
              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  md:text-5xl

                  font-bold
                  mb-3
                  text-center
                  md:text-left
                "
              >
                {filme.title}
              </h2>

              {/* infos */}
              <div
                className="
                  mb-4

                  flex
                  flex-wrap

                  justify-center
                  md:justify-start

                  items-center
                  gap-3

                  text-sm
                  text-neutral-300
                "
              >
                <span className="flex items-center gap-1">
                  <StarIcon weight="fill" className="text-amber-400" />

                  {filme.rating.toFixed(1)}
                </span>

                <span>{filme.year}</span>

                <span>{filme.duration}</span>
              </div>

              {/* descrição */}
              <p
                className="
                  text-sm
                  md:text-base

                  leading-relaxed
                  text-neutral-200

                  mb-5
                "
              >
                {filme.description}
              </p>

              {/* gêneros */}
              <div
                className="
                  flex
                  flex-wrap
                  gap-2

                  mb-5
                "
              >
                {filme.genres.split('•').map((genre) => (
                  <span
                    key={genre}
                    className="
                        rounded-full
                        border
                        border-white/10
                        bg-white/5

                        px-3
                        py-1

                        text-xs
                        md:text-sm
                      "
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* botões */}
              <div
                className="
                  flex
                  flex-col
                  sm:flex-row

                  gap-3
                "
              >
                <a
                  href={filme.watchUrl}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2

                    rounded-full
                    bg-cyan-500

                    px-5
                    py-3

                    text-sm
                    font-semibold
                    text-white

                    transition
                    hover:bg-cyan-600
                  "
                >
                  <PlayIcon weight="fill" />
                  Assistir agora
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* elenco */}
        <div className="px-4 md:px-8 pb-8 pt-6">
          {/* topo */}
          <div className="flex items-center mb-5">
            <h3 className="text-lg md:text-2xl font-semibold text-center justify-center flex-1">
              Elenco principal
            </h3>
          </div>

          {/* carrossel */}
          <div className="flex items-center gap-1">
            {/* botão esquerdo (fora do container rolável) */}
            <div className="flex-none">
              <button
                onClick={scrollLeft}
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-cyan-500"
                aria-label="Scroll left"
              >
                <CaretLeftIcon size={18} />
              </button>
            </div>

            {/* container rolável (flex-1 para não ser coberto) */}
            <div
              ref={carouselRef}
              className="flex-1 flex gap-3 overflow-x-auto scroll-smooth hide-scrollbar px-3 sm:px-6 sm:pl-2"
            >
              {filme.cast.map((actor) => (
                <div key={actor.name} className="w-[120px] flex-shrink-0 ">
                  <div className="">
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className=" rounded-md w-30 h-30 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://placehold.co/300x300/404040/FFFFFF?text=Sem+Foto'
                      }}
                    />
                  </div>

                  <div className="bg-black px-2 py-3 text-center">
                    <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                      {actor.name}
                    </h4>

                    <p className="text-[11px] sm:text-xs text-neutral-400 line-clamp-2">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}

              {filme.cast.length === 0 && (
                <p className="px-2 py-4 text-sm text-neutral-400">
                  Elenco indisponivel para este titulo.
                </p>
              )}
            </div>

            {/* botão direito (fora do container rolável) */}
            <div className="flex-none">
              <button
                onClick={scrollRight}
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-cyan-500"
                aria-label="Scroll right"
              >
                <CaretRightIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
