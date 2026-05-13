import type { Filme } from '../../types/filme'
import { Banner } from '../Banner/page'
import { Filter } from './_components/Filter/page'
import { SearchInput } from './_components/SearchInput/page'

type ExploreProps = {
  filmesFiltrados: Filme[]
  termoBusca: string
  categorias: string[]
  categoriasSelecionadas: string[]
  onTermoBuscaChange: (value: string) => void
  onToggleCategoria: (categoria: string) => void
  onClearCategorias: () => void
  onOpenDetails: (filme: Filme) => void
}

export function Explore({
  filmesFiltrados,
  termoBusca,
  categorias,
  categoriasSelecionadas,
  onTermoBuscaChange,
  onToggleCategoria,
  onClearCategorias,
  onOpenDetails,
}: ExploreProps) {
  return (
    <>
      <h2 className="text-center font-medium text-3xl mb-2 px-2">Explore filmes e séries</h2>
      <p className="text-center text-neutral-400 text-sm md:mb-5 px-2">
        Filtre e busque por filmes e séries pelo título, gênero ou ano
      </p>

      <section className="flex flex-col lg:flex-row max-w-7xl mx-auto md:gap-4 px-4 md:px-8">
        <Filter
          categorias={categorias}
          categoriasSelecionadas={categoriasSelecionadas}
          onToggleCategoria={onToggleCategoria}
          onClearCategorias={onClearCategorias}
        />

        <div className="flex-1">
          <SearchInput value={termoBusca} onChange={onTermoBuscaChange} />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2 md:p-6 md:gap-8">
            {filmesFiltrados.slice(0, 80).map((filme) => (
              <Banner
                key={`${filme.mediaType}-${filme.id}`}
                filme={filme}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
