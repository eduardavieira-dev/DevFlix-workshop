import axios from 'axios'
import type { Filme } from '../types/filme'

// ─── Configuração base ────────────────────────────────────────────────────────

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const DEFAULT_LANGUAGE = import.meta.env.VITE_TMDB_LANGUAGE || 'pt-BR'

// ─── Tipos da API do TMDB ─────────────────────────────────────────────────────

type TmdbMovie = {
  id: number
  title: string
  name?: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  genre_ids?: number[]
  genres?: Array<{ id: number; name: string }>
  runtime?: number
}

type TmdbCast = {
  name: string
  profile_path: string | null
  character: string
}

// ─── Instância do axios ───────────────────────────────────────────────────────

// Criamos uma instância do axios já configurada com a URL base e o idioma padrão.
// Assim não precisamos repetir essas configurações em cada chamada.
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { language: DEFAULT_LANGUAGE },
})

// Interceptor: antes de cada requisição, injeta automaticamente a autenticação.
// Suporta duas formas: API Key (v3) via query param, ou Bearer Token (v4) via header.
tmdbApi.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim()
  const readAccessToken = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN?.trim()

  // Prioridade: Bearer Token > API Key
  if (readAccessToken) {
    config.headers.Authorization = `Bearer ${readAccessToken}`
    return config
  }

  if (!apiKey) {
    throw new Error('Configure VITE_TMDB_API_KEY ou VITE_TMDB_READ_ACCESS_TOKEN no arquivo .env')
  }

  // Detecta se o usuário colou um JWT no campo de API Key e trata como Bearer Token
  if (apiKey.startsWith('eyJ') && apiKey.includes('.')) {
    config.headers.Authorization = `Bearer ${apiKey}`
    return config
  }

  config.params = { ...config.params, api_key: apiKey }
  return config
})

// ─── Funções utilitárias ──────────────────────────────────────────────────────

// Monta a URL completa de uma imagem do TMDB a partir do caminho retornado pela API.
function imageUrl(path: string | null, size: 'w300' | 'w500' | 'w780' | 'original') {
  if (!path) return ''
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

// Converte minutos (ex: 148) em formato legível (ex: "2h 28m").
function minutesToDuration(runtime: number | undefined) {
  if (!runtime || runtime <= 0) return '--'
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}

// Busca os gêneros de filmes e séries e retorna um Map de id → nome.
// Exemplo: Map { 28 => "Ação", 35 => "Comédia", ... }
async function loadGenresMap() {
  const [{ data: movieGenres }, { data: tvGenres }] = await Promise.all([
    tmdbApi.get<{ genres: Array<{ id: number; name: string }> }>('/genre/movie/list'),
    tmdbApi.get<{ genres: Array<{ id: number; name: string }> }>('/genre/tv/list'),
  ])

  return new Map<number, string>([
    ...movieGenres.genres.map((g): [number, string] => [g.id, g.name]),
    ...tvGenres.genres.map((g): [number, string] => [g.id, g.name]),
  ])
}

// Transforma o objeto cru da API do TMDB no formato Filme usado pelo app.
function mapMovieToFilme(movie: TmdbMovie, genresMap: Map<number, string>): Filme {
  const year = Number((movie.release_date || movie.first_air_date || '').slice(0, 4)) || new Date().getFullYear()

  // Resolve os nomes dos gêneros a partir dos IDs (quando a API retorna genre_ids)
  // ou usa os objetos de gênero diretos (quando vem do endpoint de detalhes)
  const genreNames = movie.genre_ids
    ? movie.genre_ids.map((id) => genresMap.get(id)).filter(Boolean) as string[]
    : (movie.genres ?? []).map((g) => g.name)

  return {
    id: movie.id,
    title: movie.title || movie.name || 'Sem título',
    year,
    rating: Number(movie.vote_average?.toFixed(1)) || 0,
    imageUrl: imageUrl(movie.poster_path, 'w500') || 'https://placehold.co/500x750/404040/FFFFFF?text=Sem+Imagem',
    bannerUrl:
      imageUrl(movie.backdrop_path, 'w780') ||
      imageUrl(movie.poster_path, 'w780') ||
      'https://placehold.co/1200x700/202020/FFFFFF?text=Sem+Banner',
    duration: minutesToDuration(movie.runtime),
    genres: genreNames.length > 0 ? genreNames.join(' • ') : 'Sem gênero',
    description: movie.overview || 'Descrição indisponível.',
    watchUrl: '#',
    cast: [],
  }
}

// ─── Funções exportadas (usadas pelos componentes) ────────────────────────────

// Busca os filmes e séries mais populares do momento no TMDB.
export async function fetchPopularMovies() {
  const [{ data: moviePopular }, { data: tvPopular }, genresMap] = await Promise.all([
    tmdbApi.get<{ results: TmdbMovie[] }>('/movie/popular'),
    tmdbApi.get<{ results: TmdbMovie[] }>('/tv/popular'),
    loadGenresMap(),
  ])

  const movies: Filme[] = moviePopular.results.map((movie) => ({
    ...mapMovieToFilme(movie, genresMap),
    mediaType: 'movie' as const,
  }))

  const tvs: Filme[] = tvPopular.results.map((tv) => ({
    ...mapMovieToFilme(tv, genresMap),
    mediaType: 'tv' as const,
  }))

  // Retorna filmes primeiro, seguidos pelas séries
  return [...movies, ...tvs]
}

// Busca filmes e séries pelo título digitado pelo usuário.
// Consulta até 5 páginas para trazer mais resultados.
export async function searchCatalog(query: string) {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return []

  const genresMap = await loadGenresMap()

  // Dispara as 5 páginas de busca ao mesmo tempo (em paralelo)
  const pageRequests = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      tmdbApi.get<{
        results: Array<TmdbMovie & { media_type?: 'movie' | 'tv' | 'person' }>
      }>('/search/multi', {
        params: { query: normalizedQuery, include_adult: 'false', page: i + 1 },
      })
    )
  )

  // Filtra apenas filmes e séries (ignora "person") e converte para o formato Filme
  const results: Filme[] = pageRequests.flatMap(({ data }) =>
    data.results
      .filter(
        (item): item is TmdbMovie & { media_type: 'movie' | 'tv' } =>
          item.media_type === 'movie' || item.media_type === 'tv'
      )
      .map((item) => ({ ...mapMovieToFilme(item, genresMap), mediaType: item.media_type }))
  )

  // Remove duplicatas usando um Map com chave "tipo:id"
  const unique = new Map<string, Filme>()
  for (const item of results) {
    unique.set(`${item.mediaType ?? 'movie'}:${item.id}`, item)
  }

  return Array.from(unique.values())
}

// Busca os detalhes completos de um filme ou série: duração, elenco e trailer.
export async function fetchMovieDetails(movieId: number, mediaType: 'movie' | 'tv' = 'movie') {
  const prefix = mediaType === 'movie' ? 'movie' : 'tv'

  // Busca detalhes, elenco e vídeos ao mesmo tempo para ser mais rápido
  const [{ data: details }, { data: credits }, { data: videos }] = await Promise.all([
    tmdbApi.get<TmdbMovie>(`/${prefix}/${movieId}`),
    tmdbApi.get<{ cast: TmdbCast[] }>(`/${prefix}/${movieId}/credits`),
    tmdbApi.get<{
      results: Array<{ key: string; site: string; type: string; official?: boolean }>
    }>(`/${prefix}/${movieId}/videos`),
  ])

  // Procura o primeiro trailer oficial do YouTube
  const trailer = videos.results.find(
    (v) => v.site.toLowerCase() === 'youtube' && v.type.toLowerCase() === 'trailer' && v.key
  )

  // Pega os primeiros 12 atores e formata para o nosso tipo
  const cast = credits.cast.slice(0, 12).map((actor) => ({
    name: actor.name,
    image: imageUrl(actor.profile_path, 'w300') || 'https://placehold.co/300x400/404040/FFFFFF?text=Sem+Foto',
    character: actor.character || 'Personagem não informado',
  }))

  return {
    duration: minutesToDuration(details.runtime),
    genres: (details.genres ?? []).map((g) => g.name).join(' • ') || 'Sem gênero',
    description: details.overview || 'Descrição indisponível.',
    watchUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '#',
    cast,
  }
}

export async function fetchTrendingMovies() {
  const [{ data }, genresMap] = await Promise.all([
    tmdbApi.get<{ results: TmdbMovie[] }>(
      '/trending/movie/week',
    ),
    loadGenresMap(),
  ])

  return data.results.map((movie) => ({
    ...mapMovieToFilme(movie, genresMap),
    mediaType: 'movie' as const,
  }))
}

export async function fetchTopRatedMovies() {
  const [{ data }, genresMap] = await Promise.all([
    tmdbApi.get<{ results: TmdbMovie[] }>(
      '/movie/top_rated',
    ),
    loadGenresMap(),
  ])

  return data.results.map((movie) => ({
    ...mapMovieToFilme(movie, genresMap),
    mediaType: 'movie' as const,
  }))
}

export async function fetchPopularTvShows() {
  const [{ data }, genresMap] = await Promise.all([
    tmdbApi.get<{ results: TmdbMovie[] }>('/tv/popular'),
    loadGenresMap(),
  ])

  return data.results.map((tv) => ({
    ...mapMovieToFilme(tv, genresMap),
    mediaType: 'tv' as const,
  }))
}