import './App.css'
import { Background } from './components/Background/page'
import { Carrossel } from './components/Carousel/page'
import { Explore } from './components/Explore/page'
import { Modal } from './components/Modal/page'
import { useMovieCatalog } from './hooks/useMovieCatalog'

function App() {
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

  return (
    <section className="min-h-screen w-full bg-background text-white">
      <Background filme={filmeAtual} onOpenDetails={abrirModal} />

      <Carrossel
        filmes={filmes}
        filmeAtual={filmeAtual}
        onSelectFilme={selecionarFilme}
        onOpenDetails={abrirModal}
      />

      {modalAberto && filmeSelecionado && (
        <Modal filme={filmeSelecionado} fecharModal={() => setModalAberto(false)} />
      )}
      
      <Explore
        filmesFiltrados={filmesFiltrados}
        termoBusca={termoBusca}
        categorias={categorias}
        categoriasSelecionadas={categoriasSelecionadas}
        onTermoBuscaChange={alterarTermoBusca}
        onToggleCategoria={alternarCategoria}
        onClearCategorias={limparCategorias}
        onOpenDetails={abrirModal}
      />
    </section>
  )
}

export default App
