import type { Filme } from '../types/filme'

// Funções auxiliares para manipulação do catálogo de filmes

// Gera uma chave única para cada filme, combinando tipo e ID (ex: "movie:123", "tv:456").
export function getFilmeKey(filme: Filme) {
  return `${filme.mediaType ?? 'movie'}:${filme.id}`
}

// Retorna os filmes em destaque (excluindo séries), ordenados por avaliação, limitando a 10 itens.
export function getFilmesEmDestaque(filmes: Filme[], limit = 10) {
  return [...filmes]
    .filter((filme) => filme.mediaType !== 'tv')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

// Extrai as categorias únicas (gêneros) do catálogo de filmes.
export function getCategorias(filmes: Filme[]) {
  const uniqueGenres = new Set<string>()

  filmes.forEach((filme) => {
    filme.genres
      .split('•')
      .map((genre) => genre.trim())
      .filter(Boolean)
      .forEach((genre) => uniqueGenres.add(genre))
  })

  return Array.from(uniqueGenres)
}

// Filtra os filmes com base no termo de busca e nas categorias selecionadas.
export function filtrarFilmes(
  filmes: Filme[],
  filmesEncontrados: Filme[],
  termoBusca: string,
  categoriasSelecionadas: string[]
) {
  const isSearching = termoBusca.trim().length >= 2

  // define qual lista será filtrada
  const listaBase = isSearching ? filmesEncontrados : filmes

  return listaBase.filter((filme) => {
    // filtro de busca
    const matchBusca =
      termoBusca.trim() === '' ||
      filme.title.toLowerCase().includes(termoBusca.toLowerCase())

    // transforma "Drama • Suspense" em ["drama", "suspense"]
    const generosFilme = filme.genres
      .split('•')
      .map((genre) => genre.trim().toLowerCase())

    // exige TODAS as categorias selecionadas
    const matchCategorias =
      categoriasSelecionadas.length === 0 ||
      categoriasSelecionadas.every((categoria) =>
        generosFilme.includes(categoria.toLowerCase())
      )

    return matchBusca && matchCategorias
  })
}