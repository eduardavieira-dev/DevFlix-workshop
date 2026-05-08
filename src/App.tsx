import {
  FilmSlateIcon,
  FunnelIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  StarIcon,
} from '@phosphor-icons/react'
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
  return (
    <section className="min-h-screen w-full bg-background text-white">
      <section className="relative h-[65vh] md:h-[70vh] lg:h-[85vh] w-full overflow-hidden">
        <img
          src="background.png"
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
            <h1 className="mb-4 text-4xl md:text-6xl font-bold">O Drama</h1>

            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <StarIcon weight="fill" className="text-amber-400" /> 7.0
              </span>
              <span>2026</span>
              <span>1h 46m</span>
              <span>Romance • Comédia • Drama</span>
            </div>

            <p className="mb-6 max-w-lg leading-relaxed text-gray-200">
              Profundamente apaixonados e em meio aos preparativos finais para o grande dia do
              casamento, o casal tem sua felicidade ameaçada quando vêm à tona segredos que jamais
              poderiam imaginar.
            </p>

            <div className="flex flex-wrap gap-2">
              <button className="text-sm md:text-md rounded-full bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 cursor-pointer flex items-center gap-1">
                <PlayIcon weight="fill" /> Assistir
              </button>

              <button className="text-sm md:text-md rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10 cursor-pointer">
                Mais informações
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-20 mx-auto -mt-6 md:-mt-2 max-w-7xl px-5 pb-10">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
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

          <div className="flex flex-wrap gap-1.5 text-sm text-gray-300">
            {categorias.map((cat) => (
              <span key={cat} className="text-xs border border-neutral-700 rounded-full px-3 py-1">
                {cat}
              </span>
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
