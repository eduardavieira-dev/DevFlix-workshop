import { BookmarkSimpleIcon, Heart } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Banner } from '../../components/Banner/page'
import type { Filme } from '../../types/filme'
import { FAVORITES_UPDATED_EVENT, getFavorites } from '../../utils/favorites'
import { Footer } from '../../components/Footer/page'

type FavoritesPageProps = {
  onOpenDetails: (filme: Filme) => void
}

export function FavoritesPage({ onOpenDetails }: FavoritesPageProps) {
  const [favorites, setFavorites] = useState<Filme[]>([])

  useEffect(() => {
    function loadFavorites() {
      setFavorites(getFavorites())
    }

    loadFavorites()

    window.addEventListener(FAVORITES_UPDATED_EVENT, loadFavorites)
    window.addEventListener('storage', loadFavorites)

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, loadFavorites)
      window.removeEventListener('storage', loadFavorites)
    }
  }, [])

  if (favorites.length === 0) {
    return (
      <div>
        <main className="min-h-screen bg-background text-white flex items-center justify-center">
          <section className="min-h-[60vh] flex items-center justify-center w-full">
            <div className="text-center py-20">
              <h2 className="text-2xl md:text-3xl font-semibold mb-1">Minha lista</h2>
              <p className="text-sm text-neutral-400 mb-8">0 títulos salvos</p>

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/3">
                <Heart size={28} weight="regular" className="text-purple-400" />
              </div>

              <h3 className="text-lg font-semibold mb-1">Sua lista está vazia</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Favorite seus filmes e séries preferidos.
              </p>

              <div className="flex items-center justify-center">
                <a
                  href="#/explore"
                  className="rounded-full bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
                >
                  Explorar filmes e séries
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <main className="min-h-screen bg-background text-white">
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 md:px-6">
          <header className="mb-6 flex items-end justify-between gap-3">
            <h2 className="text-3xl md:text-3xl font-semibold flex gap-1 items-center"><BookmarkSimpleIcon className='text-purple-300'/> Minha lista</h2>
            <p className="text-sm text-neutral-400">{favorites.length} título(s) salvo(s)</p>
          </header>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {favorites.map((filme) => (
              <div key={`${filme.mediaType ?? 'movie'}:${filme.id}`}>
                <Banner filme={filme} onOpenDetails={onOpenDetails} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
