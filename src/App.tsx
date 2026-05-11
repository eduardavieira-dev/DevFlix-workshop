import {
  CaretLeftIcon,
  CaretRightIcon,
  FilmSlateIcon,
  FunnelIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  StarIcon,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { Banner } from './components/Banner'
import { Card } from './components/Card'
import { Modal } from './components/Modal'
import { fetchMovieDetails, fetchPopularMovies, searchCatalog } from './services/tmdb'
import type { Filme } from './types/filme'

function App() {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [filmeAtual, setFilmeAtual] = useState<Filme | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [termoBusca, setTermoBusca] = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [filmesEncontrados, setFilmesEncontrados] = useState<Filme[]>([])

  const carouselRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let active = true

    async function loadMovies() {
      try {
        setCarregando(true)
        const data = await fetchPopularMovies()

        if (!active) {
          return
        }

        setFilmes(data)
        setFilmeAtual(data[0] ?? null)

        void Promise.allSettled(data.slice(0, 8).map((item) => enrichMovie(item)))
      } catch (error) {
        if (!active) {
          return
        }

        setErro(error instanceof Error ? error.message : 'Erro ao carregar filmes.')
      } finally {
        if (active) {
          setCarregando(false)
        }
      }
    }

    loadMovies()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!filmeAtual || filmeAtual.watchUrl !== '#') {
      return
    }

    const currentMovie = filmeAtual

    let active = true

    async function preloadTrailer() {
      try {
        const detailedMovie = await enrichMovie(currentMovie)

        if (!active) {
          return
        }

        setFilmeAtual(detailedMovie)
      } catch {
        // Keep the current item as-is if trailer lookup fails.
      }
    }

    void preloadTrailer()

    return () => {
      active = false
    }
  }, [filmeAtual])

  useEffect(() => {
    const termo = termoBusca.trim()

    if (termo.length < 2) {
      setFilmesEncontrados([])
      return
    }

    let active = true

    const timeout = window.setTimeout(async () => {
      try {
        if (!active) {
          return
        }

        const remoteResults = await searchCatalog(termo)
        setFilmesEncontrados(remoteResults)
      } catch {
        if (active) {
          setFilmesEncontrados([])
        }
      }
    }, 350)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [termoBusca])

  useEffect(() => {
    if (filmes.length === 0 || modalAberto) {
      return
    }

    const interval = setInterval(() => {
      setFilmeAtual((prev) => {
        if (!prev) {
          return filmes[0]
        }

        const currentIndex = filmes.findIndex((filme) => filme.id === prev.id)
        const nextIndex = currentIndex === filmes.length - 1 ? 0 : currentIndex + 1

        return filmes[nextIndex]
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [filmes, modalAberto])

  async function enrichMovie(movie: Filme) {
    if (movie.cast.length > 0 && movie.duration !== '--') {
      return movie
    }

    const details = await fetchMovieDetails(movie.id, movie.mediaType ?? 'movie')
    const detailedMovie: Filme = {
      ...movie,
      ...details,
    }

    setFilmes((prev) => prev.map((item) => (item.id === detailedMovie.id ? detailedMovie : item)))

    setFilmeAtual((prev) => {
      if (!prev || prev.id !== detailedMovie.id) {
        return prev
      }

      return detailedMovie
    })

    return detailedMovie
  }

  async function abrirModal(filme: Filme) {
    setFilmeSelecionado(filme)
    setModalAberto(true)

    try {
      const detailedMovie = await enrichMovie(filme)
      setFilmeSelecionado(detailedMovie)
    } catch {
      // Keep basic movie data in modal if details request fails.
    }
  }

  const categorias = useMemo(() => {
    const uniqueGenres = new Set<string>()

    filmes.forEach((filme) => {
      filme.genres
        .split('•')
        .map((genre) => genre.trim())
        .filter(Boolean)
        .forEach((genre) => uniqueGenres.add(genre))
    })

    return Array.from(uniqueGenres)
  }, [filmes])

  const filmesEmDestaque = useMemo(() => {
    return [...filmes]
      .filter((filme) => filme.mediaType !== 'tv')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
  }, [filmes])

  const isSearching = termoBusca.trim().length >= 2

  const filmesFiltrados = useMemo(() => {
    if (isSearching) {
      return filmesEncontrados
    }

    return filmes.filter((filme) => {
      const matchCategory = categoriaSelecionada
        ? filme.genres.toLowerCase().includes(categoriaSelecionada.toLowerCase())
        : true

      return matchCategory
    })
  }, [isSearching, filmesEncontrados, filmes, categoriaSelecionada])

  const scrollLeft = () => {
    if (!carouselRef.current) {
      return
    }

    const cardWidth = carouselRef.current.querySelector('div')?.clientWidth || 0

    carouselRef.current.scrollBy({
      left: -(cardWidth + 12),
      behavior: 'smooth',
    })
  }

  const scrollRight = () => {
    if (!carouselRef.current) {
      return
    }

    const cardWidth = carouselRef.current.querySelector('div')?.clientWidth || 0

    carouselRef.current.scrollBy({
      left: cardWidth + 12,
      behavior: 'smooth',
    })
  }

  if (carregando) {
    return (
      <section className="min-h-screen w-full bg-background text-white flex items-center justify-center">
        <p className="text-neutral-300">Carregando filmes do TMDB...</p>
      </section>
    )
  }

  if (erro) {
    return (
      <section className="min-h-screen w-full bg-background text-white flex items-center justify-center px-4">
        <p className="text-center text-red-300">
          {erro}
          <br />
          Confira se `VITE_TMDB_API_KEY` esta configurada no arquivo `.env`.
        </p>
      </section>
    )
  }

  if (!filmeAtual) {
    return (
      <section className="min-h-screen w-full bg-background text-white flex items-center justify-center">
        <p className="text-neutral-300">Nenhum filme encontrado.</p>
      </section>
    )
  }

  return (
    <section className="min-h-screen w-full bg-background text-white">
      <section className="relative h-[65vh] md:h-[70vh] lg:h-[85vh] w-full overflow-hidden">
        <img
          src={filmeAtual.bannerUrl}
          alt={filmeAtual.title}
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
            <h1 className="mb-4 text-4xl md:text-6xl font-bold">{filmeAtual.title}</h1>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-neutral-300">
              <span className="flex items-center gap-1">
                <StarIcon weight="fill" className="text-amber-400" /> {filmeAtual.rating.toFixed(1)}
              </span>
              <span>{filmeAtual.year}</span>
              <span>{filmeAtual.duration}</span>
              <span>{filmeAtual.genres}</span>
            </div>

            <p className="mb-6 max-w-lg leading-relaxed line-clamp-4 text-neutral-200">
              {filmeAtual.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <a
                href={filmeAtual.watchUrl !== '#' ? filmeAtual.watchUrl : undefined}
                target={filmeAtual.watchUrl !== '#' ? '_blank' : undefined}
                rel={filmeAtual.watchUrl !== '#' ? 'noreferrer' : undefined}
                aria-disabled={filmeAtual.watchUrl === '#'}
                className="text-sm md:text-md rounded-full bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 cursor-pointer flex items-center gap-1"
              >
                <PlayIcon weight="fill" /> Assistir
              </a>

              <button
                onClick={() => abrirModal(filmeAtual)}
                className="text-sm md:text-md rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10 cursor-pointer flex items-center gap-1"
              >
                <InfoIcon size={18} />
                Mais informacoes
              </button>
            </div>
          </div>
        </div>

        {modalAberto && filmeSelecionado && (
          <Modal filme={filmeSelecionado} fecharModal={() => setModalAberto(false)} />
        )}
      </section>
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
              const ativo = filme.id === filmeAtual.id

              return (
                <div
                  key={filme.id}
                  onClick={() => {
                    setFilmeAtual(filme)
                    void enrichMovie(filme)
                  }}
                  className={`
                    min-w-[48%]
                    sm:min-w-[31%]
                    md:min-w-[23%]
                    lg:min-w-[19.2%]
                    flex-shrink-0
                    transition-all
                    duration-300
                    cursor-pointer

                    ${ativo ? 'scale-105 -translate-y-2' : 'opacity-70 hover:opacity-100'}
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
            className="rounded-full border border-white/20 bg-white/5 p-3 text-white backdrop-blur-md transition hover:bg-white/10 hover:text-cyan-500 hover:border-cyan-500 cursor-pointer"
          >
            <CaretLeftIcon weight="bold" />
          </button>

          <button
            onClick={scrollRight}
            className="rounded-full border border-white/20 bg-white/5 p-3 text-white backdrop-blur-md transition hover:bg-white/10 hover:text-cyan-500 hover:border-cyan-500 cursor-pointer"
          >
            <CaretRightIcon weight="bold" />
          </button>
        </div>
      </main>

      <h2 className="text-center font-medium text-3xl mb-2 px-2">Explore filmes e series</h2>
      <p className="text-center text-neutral-400 text-sm md:mb-5 px-2">
        Filtre e busque por filmes e series pelo titulo, genero ou ano
      </p>

      <section className="flex flex-col lg:flex-row max-w-7xl mx-auto md:gap-4 px-4 md:px-8">
        <aside className="w-full lg:w-58 flex-none lg:border-r border-neutral-800 py-6 px-4 md:px-1 flex flex-col gap-4">
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
        </aside>

        <div className="flex-1">
          <div className="relative w-full max-w-4xl mx-auto lg:pr-10 mb-2">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />

            <input
              type="search"
              value={termoBusca}
              onChange={(event) => setTermoBusca(event.target.value)}
              placeholder="Pesquisar filmes ou series..."
              className="w-full rounded-full border border-neutral-700 bg-white/5 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-neutral-500 transition focus:border-cyan-400 focus:bg-white/10"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2 md:p-6 md:gap-8">
            {filmesFiltrados.slice(0, 80).map((filme) => (
              <Banner
                key={`${filme.mediaType}-${filme.id}`}
                filme={filme}
                onOpenDetails={abrirModal}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}

export default App
