import { Explore } from '../../components/Explore/page'
import { Footer } from '../../components/Footer/page'
import type { Filme } from '../../types/filme'

type SearchPageProps = {
  filmesFiltrados: Filme[]
  termoBusca: string
  categorias: string[]
  categoriasSelecionadas: string[]
  onTermoBuscaChange: (value: string) => void
  onToggleCategoria: (categoria: string) => void
  onClearCategorias: () => void
  onOpenDetails: (filme: Filme) => void
}

export function SearchPage(props: SearchPageProps) {
  return (
    <div>
      <main className="min-h-screen bg-background text-white pt-12">
        <div className="max-w-7xl mx-auto w-full md:px-8 py-18">
          <Explore {...props} />
        </div>
      </main>
      <Footer/>
    </div>
  )
}
