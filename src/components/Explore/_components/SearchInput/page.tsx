import { MagnifyingGlassIcon } from '@phosphor-icons/react'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto lg:pr-10 mb-2">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
        size={20}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquisar filmes ou séries..."
        className="w-full rounded-full border border-neutral-700 bg-white/5 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-neutral-500 transition focus:border-cyan-400 focus:bg-white/10"
      />
    </div>
  )
}
