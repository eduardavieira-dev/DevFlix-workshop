import './App.css'
import { Background } from './components/Background/page'
import { Header } from './components/Header/page'
import { Carrossel } from './components/Carousel/page'
import { Modal } from './components/Modal/page'
import { useMovieCatalog } from './hooks/useMovieCatalog'
import { FavoritesPage } from './pages/Favorites/page'
import { SearchPage } from './pages/Search/page'
import { useEffect, useState } from 'react'
import { MovieSection } from './components/MovieSection/page'

import { fetchTrendingMovies, fetchTopRatedMovies, fetchPopularTvShows } from './services/tmdb'
import { Footer } from './components/Footer/page'

function App() {
  const [route, setRoute] = useState<string>(window.location.hash.replace('#', '') || '/')
  const [trendingMovies, setTrendingMovies] = useState<any[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([])
  const [popularTvShows, setPopularTvShows] = useState<any[]>([])

  useEffect(() => {
    async function loadHomeSections() {
      try {
        const [trending, topRated, tvShows] = await Promise.all([
          fetchTrendingMovies(),
          fetchTopRatedMovies(),
          fetchPopularTvShows(),
        ])

        setTrendingMovies(trending)
        setTopRatedMovies(topRated)
        setPopularTvShows(tvShows)
      } catch (error) {
        console.error(error)
      }
    }

    loadHomeSections()
  }, [])

  useEffect(() => {
    function onHash() {
      setRoute(window.location.hash.replace('#', '') || '/')
    }

    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const {
    carregando,
    erro,
    filmeAtual,
    filmeSelecionado,
    filmes,
    filmesFiltrados,
    categorias,
    categoriasSelecionadas,
    termoBusca,
    modalAberto,
    setModalAberto,
    abrirModal,
    selecionarFilme,
    alterarTermoBusca,
    alternarCategoria,
    limparCategorias,
  } = useMovieCatalog()

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
          Confira se `VITE_TMDB_API_KEY` está configurada no arquivo `.env`.
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

  // Route rendering
  if (route === '/favorites' || route === '/minha-lista' || route === '#/minha-lista') {
    return (
      <>
        <Header />
        <FavoritesPage onOpenDetails={abrirModal} />

        {modalAberto && filmeSelecionado && (
          <Modal filme={filmeSelecionado} fecharModal={() => setModalAberto(false)} />
        )}
      </>
    )
  }

  if (route === '/explore' || route === '/search' || route === '/explorar') {
    return (
      <>
        <Header />
        <SearchPage
          filmesFiltrados={filmesFiltrados}
          termoBusca={termoBusca}
          categorias={categorias}
          categoriasSelecionadas={categoriasSelecionadas}
          onTermoBuscaChange={alterarTermoBusca}
          onToggleCategoria={alternarCategoria}
          onClearCategorias={limparCategorias}
          onOpenDetails={abrirModal}
        />

        {modalAberto && filmeSelecionado && (
          <Modal filme={filmeSelecionado} fecharModal={() => setModalAberto(false)} />
        )}
      </>
    )
  }

  return (
    <>
      <Header />
      <section className="min-h-screen w-full bg-background text-white">
        <Background filme={filmeAtual} onOpenDetails={abrirModal} />

        <div id="filmes-e-series">
          <Carrossel
            filmes={filmes}
            filmeAtual={filmeAtual}
            onSelectFilme={selecionarFilme}
            onOpenDetails={abrirModal}
          />
        </div>

        <div className="relative z-20 space-y-12 pb-24 md:max-w-7xl mx-auto">
          <MovieSection titulo="Em destaque" filmes={trendingMovies} onOpenDetails={abrirModal} />

          <MovieSection
            titulo="Mais bem avaliados"
            filmes={topRatedMovies}
            onOpenDetails={abrirModal}
          />

          <MovieSection
            titulo="Séries populares"
            filmes={popularTvShows}
            onOpenDetails={abrirModal}
          />
        </div>

        {modalAberto && filmeSelecionado && (
          <Modal filme={filmeSelecionado} fecharModal={() => setModalAberto(false)} />
        )}
      </section>
      <Footer />
    </>
  )
}

export default App
