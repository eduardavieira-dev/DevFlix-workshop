import { useEffect, useMemo, useState } from 'react'
import { fetchMovieDetails, fetchPopularMovies, searchCatalog } from '../services/tmdb'
import type { Filme } from '../types/filme'
import {
  filtrarFilmes,
  getCategorias,
  getFilmeKey,
  getFilmesEmDestaque,
} from '../utils/movieCatalog'

export function useMovieCatalog() {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [filmeAtual, setFilmeAtual] = useState<Filme | null>(null)
  const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [termoBusca, setTermoBusca] = useState('')
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([])
  const [filmesEncontrados, setFilmesEncontrados] = useState<Filme[]>([])

  const filmesEmDestaque = useMemo(() => getFilmesEmDestaque(filmes), [filmes])
  const categorias = useMemo(() => getCategorias(filmes), [filmes])
  const filmesFiltrados = useMemo(
    () => filtrarFilmes(filmes, filmesEncontrados, termoBusca, categoriasSelecionadas),
    [filmes, filmesEncontrados, termoBusca, categoriasSelecionadas]
  )

  async function enrichMovie(movie: Filme) {
    if (movie.cast.length > 0 && movie.duration !== '--') return movie

    const details = await fetchMovieDetails(movie.id, movie.mediaType ?? 'movie')
    const detailedMovie: Filme = { ...movie, ...details }

    setFilmes((prev) =>
      prev.map((item) => (getFilmeKey(item) === getFilmeKey(detailedMovie) ? detailedMovie : item))
    )

    setFilmeAtual((prev) => {
      if (!prev || getFilmeKey(prev) !== getFilmeKey(detailedMovie)) return prev
      return detailedMovie
    })

    return detailedMovie
  }

  // Busca os filmes populares (filmes e séries) para exibir no catálogo inicial.
  useEffect(() => {
    let active = true

    async function loadMovies() {
      try {
        setCarregando(true)
        const data = await fetchPopularMovies()

        if (!active) return

        setFilmes(data)
        setFilmeAtual(getFilmesEmDestaque(data, 1)[0] ?? data[0] ?? null)

        void Promise.allSettled(data.slice(0, 8).map((item) => enrichMovie(item)))
      } catch (error) {
        if (!active) return
        setErro(error instanceof Error ? error.message : 'Erro ao carregar filmes.')
      } finally {
        if (active) setCarregando(false)
      }
    }

    loadMovies()
    return () => {
      active = false
    }
    // enrichMovie is a function declaration below and is safe to reference here.
  }, [])

  useEffect(() => {
    if (!filmeAtual || filmeAtual.watchUrl !== '#') return

    const currentMovie = filmeAtual
    let active = true

    async function preloadTrailer() {
      try {
        const detailedMovie = await enrichMovie(currentMovie)
        if (!active) return
        setFilmeAtual(detailedMovie)
      } catch {
        // keep the current movie as-is if trailer lookup fails
      }
    }

    void preloadTrailer()
    return () => {
      active = false
    }
  }, [filmeAtual])

  useEffect(() => {
    const ordemDestaques = getFilmesEmDestaque(filmes)

    if (ordemDestaques.length === 0 || modalAberto) return

    const interval = setInterval(() => {
      setFilmeAtual((prev) => {
        if (!prev) return ordemDestaques[0]

        const currentIndex = ordemDestaques.findIndex((filme) => getFilmeKey(filme) === getFilmeKey(prev))
        if (currentIndex === -1) return ordemDestaques[0]

        const nextIndex = currentIndex === ordemDestaques.length - 1 ? 0 : currentIndex + 1
        return ordemDestaques[nextIndex]
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [filmes, modalAberto])

  useEffect(() => {
    const termo = termoBusca.trim()

    if (termo.length < 2) {
      setFilmesEncontrados([])
      return
    }

    let active = true

    const timeout = window.setTimeout(async () => {
      try {
        if (!active) return
        const remoteResults = await searchCatalog(termo)
        setFilmesEncontrados(remoteResults)
      } catch {
        if (active) setFilmesEncontrados([])
      }
    }, 350)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [termoBusca])

  async function abrirModal(filme: Filme) {
    setFilmeSelecionado(filme)
    setModalAberto(true)

    try {
      const detailedMovie = await enrichMovie(filme)
      setFilmeSelecionado(detailedMovie)
    } catch {
      // Keep basic data if details fail.
    }
  }

  function selecionarFilme(filme: Filme) {
    setFilmeAtual(filme)
  }

  function alterarTermoBusca(value: string) {
    setTermoBusca(value)
  }

  function alternarCategoria(categoria: string) {
    setCategoriasSelecionadas((prev) =>
      prev.includes(categoria) ? prev.filter((item) => item !== categoria) : [...prev, categoria]
    )
  }

  function limparCategorias() {
    setCategoriasSelecionadas([])
  }

  return {
    carregando,
    erro,
    filmeAtual,
    filmeSelecionado,
    filmes,
    filmesEmDestaque,
    filmesFiltrados,
    categorias,
    categoriasSelecionadas,
    termoBusca,
    modalAberto,
    setModalAberto,
    setFilmeSelecionado,
    setFilmeAtual,
    abrirModal,
    selecionarFilme,
    alterarTermoBusca,
    alternarCategoria,
    limparCategorias,
  }
}