import {
  CaretLeftIcon,
  CaretRightIcon,
  FilmSlateIcon,
  FunnelIcon,
  HeartIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  StarIcon,
} from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Banner } from './Banner'
import { Card } from './Card'

function App() {
  const categorias = [
    'Ação',
    'Drama',
    'Terror',
    'Comédia',
    'Romance',
    'Ficção Científica',
    'Animação',
    'Documentário',
  ]
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('div')?.clientWidth || 0

      carouselRef.current.scrollBy({
        left: -(cardWidth + 12),
        behavior: 'smooth',
      })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('div')?.clientWidth || 0

      carouselRef.current.scrollBy({
        left: cardWidth + 12,
        behavior: 'smooth',
      })
    }
  }
 const filmes = [
  {
    id: 1,
    title: 'O Drama',
    year: 2026,
    rating: 7.0,
    imageUrl: 'background.png',
    bannerUrl: 'background.png',
    duration: '1h 46m',
    genres: 'Romance • Comédia • Drama',
    description:
      'Profundamente apaixonados e em meio aos preparativos finais para o grande dia do casamento...',
    watchUrl: '#',
  },

  {
    id: 2,
    title: 'Batman',
    year: 2025,
    rating: 8.5,
    imageUrl: 'batman.png',
    bannerUrl: 'batman-banner.png',
    duration: '2h 10m',
    genres: 'Ação • Crime',
    description:
      'Batman precisa enfrentar uma nova ameaça que coloca Gotham inteira em perigo.',
    watchUrl: '#',
  },

  {
    id: 3,
    title: 'Interestelar',
    year: 2014,
    rating: 9.1,
    imageUrl: 'interestelar.png',
    bannerUrl: 'interestelar-banner.png',
    duration: '2h 49m',
    genres: 'Ficção Científica • Drama',
    description:
      'Uma equipe de astronautas viaja por um buraco de minhoca em busca da sobrevivência da humanidade.',
    watchUrl: '#',
  },
]

const [filmeAtual, setFilmeAtual] = useState(filmes[0])

useEffect(() => {
  const interval = setInterval(() => {
    setFilmeAtual((prev) => {
      const currentIndex = filmes.findIndex(
        (filme) => filme.id === prev.id
      )

      const nextIndex =
        currentIndex === filmes.length - 1
          ? 0
          : currentIndex + 1

      return filmes[nextIndex]
    })
  }, 10000)

  return () => clearInterval(interval)
}, [])

  return (
    <section className="min-h-screen w-full bg-background text-white">
      <section className="relative h-[65vh] md:h-[70vh] lg:h-[85vh] w-full overflow-hidden">
        <img
          src={filmeAtual.bannerUrl}
          alt=""
          className="absolute inset-0 w-full object-contain md:object-cover md:object-top md:h-full"
        />

        {/* overlay escuro */}
        <div className="absolute inset-0  bg-black/60 md:bg-black/40" />

        {/* degradê */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/100 md:via-background/60 to-black/10" />

        <h2 className="absolute top-6 left-6 md:left-30 z-20 flex items-center gap-2 text-xl md:text-2xl font-semibold">
          <FilmSlateIcon size={24} className="text-cyan-400" />

          <span>
            Dev<span className="text-cyan-400">Flix</span>
          </span>
        </h2>

        <div className="relative z-10 flex h-full items-end md:left-20">
          <div className="max-w-xl px-6 md:px-10 pb-16 md:pb-24">
            <h1 className="mb-4 text-4xl md:text-6xl font-bold">{filmeAtual.title}</h1>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-neutral-300">
              <span className="flex items-center gap-1">
                <StarIcon weight="fill" className="text-amber-400" /> {filmeAtual.rating.toFixed(1)}
              </span>
              <span>{filmeAtual.year}</span>
              <span>{filmeAtual.duration}</span>
              <span>{filmeAtual.genres}</span>
            </div>

            <p className="mb-6 max-w-lg leading-relaxed text-neutral-200">
              {filmeAtual.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <a href={filmeAtual.watchUrl} className="text-sm md:text-md rounded-full bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 cursor-pointer flex items-center gap-1">
                <PlayIcon weight="fill" /> Assistir
              </a>

              <a className="text-sm md:text-md rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10 cursor-pointer flex items-center gap-1">
                <InfoIcon size={18} />
                Mais informações
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-20 mx-auto -mt-6 md:-mt-2 max-w-7xl px-5 pb-10">
        <div className="relative">
          <div
            ref={carouselRef}
            className="
              flex
              gap-3
              overflow-x-auto
              scroll-smooth
              pb-2
              hide-scrollbar
              px-1 md:px-2
            "
          >
          {filmes.map((filme) => {
          const ativo = filme.id === filmeAtual.id

          return (
              <div
                key={filme.id}
                onClick={() => setFilmeAtual(filme)}
                className={`
                  min-w-[48%]
                  sm:min-w-[31%]
                  md:min-w-[23%]
                  lg:min-w-[19.2%]
                  flex-shrink-0
                  transition-all
                  duration-300
                  cursor-pointer

                  ${
                    ativo
                      ? 'scale-105 -translate-y-2'
                      : 'opacity-70 hover:opacity-100'
                  }
                `}
              >
                <Card {...filme} />
              </div>
            )})}
          </div>
        </div>

        <div id="card-buttons" className="flex gap-2 justify-end mt-4">
          <button
            onClick={scrollLeft}
            className="
        rounded-full
        border border-white/20
        bg-white/5
        p-3
        text-white
        backdrop-blur-md
        transition
        hover:bg-white/10
        hover:text-cyan-500
        hover:border-cyan-500
        cursor-pointer
      "
          >
            <CaretLeftIcon weight="bold" />
          </button>

          <button
            onClick={scrollRight}
            className="
        rounded-full
        border border-white/20
        bg-white/5
        p-3
        text-white
        backdrop-blur-md
        transition
        hover:bg-white/10
        hover:text-cyan-500
        hover:border-cyan-500
        cursor-pointer
      "
          >
            <CaretRightIcon weight="bold" />
          </button>
        </div>
      </main>

      <h2 className="text-center font-medium text-3xl mb-2 px-2">Explore filmes e séries</h2>
      <p className="text-center text-neutral-400 text-sm md:mb-5 px-2">
        Filtre e busque por filmes e séries pelo título, gênero ou ano
      </p>
      <section className="flex flex-col lg:flex-row max-w-7xl mx-auto md:gap-4 px-4 md:px-8">
        <aside
          className="
            w-full lg:w-58
            flex-none
             lg:border-r
            border-neutral-800
            py-6 px-4 md:px-1
            flex flex-col gap-4
          "
        >
          <h4 className="font-medium text-lg flex items-center gap-1">
            <FunnelIcon className="text-cyan-500" />
            Filtrar
          </h4>

          <div className="flex flex-wrap gap-1.5 text-sm text-neutral-300">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSelecionada(categoriaSelecionada === cat ? '' : cat)}
                className={`
                  text-xs
                  rounded-full
                  px-3
                  py-1
                  border
                  transition
                  cursor-pointer

                  ${
                    categoriaSelecionada === cat
                      ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10'
                      : 'border-neutral-700 text-neutral-300 hover:border-cyan-500 hover:text-cyan-500'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="border-t border-neutral-800 lg:mr-6 pt-4">
            <button
              className="
          text-sm md:text-md
          rounded-full
          border border-white/20
          bg-cyan-500/70
          px-4 py-3
          w-full
          font-semibold
          text-white
          backdrop-blur-md
          transition
          hover:bg-white/10
          hover:text-cyan-400
          hover:border-cyan-400
          cursor-pointer
          flex items-center justify-center gap-1
        "
            >
              <HeartIcon weight="fill" />
              Favoritos
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="relative w-full max-w-4xl  mx-auto lg:pr-10 mb-2">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />

            <input
              type="search"
              placeholder="Pesquisar filmes ou séries..."
              className="
                w-full
                rounded-full
                border border-neutral-700
                bg-white/5
                py-3
                pl-12
                pr-4
                text-sm
                text-white
                outline-none
                placeholder:text-neutral-500
                transition
                focus:border-cyan-400
                focus:bg-white/10
              "
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2 md:p-6 md:gap-8">
            <Banner />
            <Banner />
            <Banner />
            <Banner />
            <Banner />
          </div>
        </div>
      </section>
    </section>
  )
}

export default App
