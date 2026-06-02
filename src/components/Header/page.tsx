import { FilmSlateIcon, ListIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

export function Header() {
  const [route, setRoute] = useState<string>(window.location.hash.replace('#', '') || '/')

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onHash() {
      setRoute(window.location.hash.replace('#', '') || '/')
      setMenuOpen(false)
    }

    function onScroll() {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('hashchange', onHash)
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  function goTo(target: string) {
    setMenuOpen(false)

    if (target === 'home') return (window.location.hash = '/')
    if (target === 'filmes-e-series') return (window.location.hash = '/explore')
    if (target === 'minha-lista') return (window.location.hash = '/favorites')
  }

  const navItems = [
    { label: 'Home', target: 'home' },
    { label: 'Filmes e Séries', target: 'filmes-e-series' },
    { label: 'Minha Lista', target: 'minha-lista' },
  ]

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-5 transition-[background-color,backdrop-filter,box-shadow] duration-300 md:px-8 lg:px-12 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
            : 'bg-transparent'
        }`}
      >
        <div
          className="flex cursor-pointer items-center gap-2 text-xl font-semibold text-white md:ml-16"
          onClick={() => goTo('home')}
        >
          <FilmSlateIcon size={24} className="text-purple-400" />

          <span>
            Dev<span className="text-purple-400">Flix</span>
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex md:mr-26 border-white/20 ">
          {navItems.map((item) => {
            const active =
              (route === '/' || route === '') && item.target === 'home'
                ? true
                : route.includes('explore') && item.target === 'filmes-e-series'
                  ? true
                  : route.includes('favorites') && item.target === 'minha-lista'
                    ? true
                    : false

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => goTo(item.target)}
                className={`relative text-sm font-medium transition ${
                  active ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-purple-400 rounded-2xl" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white md:hidden"
          >
            {menuOpen ? <XIcon size={24} weight="bold" /> : <ListIcon size={24} />}
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-[260px] border-l border-white/10 bg-[#0b0b0f]/95 backdrop-blur-2xl transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <span>Menu</span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="text-white/70 transition hover:text-white"
          >
            <XIcon size={22} />
          </button>
        </div>

        <nav className="flex flex-col px-3 py-4">
          {navItems.map((item) => {
            const active =
              (route === '/' || route === '') && item.target === 'home'
                ? true
                : route.includes('explore') && item.target === 'filmes-e-series'
                  ? true
                  : route.includes('favorites') && item.target === 'minha-lista'
                    ? true
                    : false

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => goTo(item.target)}
                className={`flex items-center px-4 py-3 text-sm font-medium transition ${
                  active
                    ? ' bg-purple-500/10 text-purple-400'
                    : 'border-l-2 border-transparent text-white/60 hover:bg-white/[0.03] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
