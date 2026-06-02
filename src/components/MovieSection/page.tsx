import type { Filme } from '../../types/filme'
import { Banner } from '../Banner/page'

type MovieSectionProps = {
  titulo: string
  filmes: Filme[]
  onOpenDetails: (filme: Filme) => void
}

export function MovieSection({
  titulo,
  filmes,
  onOpenDetails,
}: MovieSectionProps) {
  return (
    <section className="space-y-6">
      <div className="px-4 md:px-10">
        <h2 className="text-2xl font-bold text-white">
          {titulo}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-10 px-4 md:grid-cols-3 md:px-10 xl:grid-cols-5">
        {filmes.slice(0, 5).map((filme) => (
          <Banner
            key={`${filme.mediaType}-${filme.id}`}
            filme={filme}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </section>
  )
}