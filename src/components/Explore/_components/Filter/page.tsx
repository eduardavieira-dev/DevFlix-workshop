import { FunnelIcon } from '@phosphor-icons/react'
type FilterProps = {
  categorias: string[]
  categoriasSelecionadas: string[]
  onToggleCategoria: (categoria: string) => void
  onClearCategorias: () => void
}

export function Filter({
  categorias,
  categoriasSelecionadas,
  onToggleCategoria,
  onClearCategorias,
}: FilterProps) {
  return (
    <aside className="w-full lg:w-58 flex-none lg:border-r border-neutral-800 py-6 px-4 md:px-1 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-lg flex items-center gap-1">
          <FunnelIcon className="text-cyan-500" />
          Filtrar
        </h4>

        {categoriasSelecionadas.length > 0 && (
          <button
            onClick={onClearCategorias}
            className="text-xs rounded-full px-3 py-1 border border-orange-400 text-orange-400 hover:border-orange-500 hover:text-orange-500 mr-2"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 text-sm text-neutral-300">
        {categorias.map((cat) => {
          const active = categoriasSelecionadas.includes(cat)

          return (
            <button
              key={cat}
              onClick={() => onToggleCategoria(cat)}
              className={`
                text-xs rounded-full px-3 py-1 border transition cursor-pointer
                ${
                  active
                    ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10'
                    : 'border-neutral-700 text-neutral-300 hover:border-cyan-500 hover:text-cyan-500'
                }
              `}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
