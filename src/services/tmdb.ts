import type { Filme } from '../types/filme'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const DEFAULT_LANGUAGE = import.meta.env.VITE_TMDB_LANGUAGE || 'pt-BR'

function resolveAuthConfig() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim()
  const readAccessToken = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN?.trim()

  if (readAccessToken) {
    return {
      mode: 'bearer' as const,
      token: readAccessToken,
    }
  }

  if (!apiKey) {
    throw new Error(
      'Configure VITE_TMDB_API_KEY (v3) ou VITE_TMDB_READ_ACCESS_TOKEN (v4) no arquivo .env',
    )
  }

  // Muitos usuarios colam o token JWT (v4) no campo de API key. Fazemos fallback automatico.
  if (apiKey.startsWith('eyJ') && apiKey.includes('.')) {
    return {
      mode: 'bearer' as const,
      token: apiKey,
    }
  }

  return {
    mode: 'query' as const,
    apiKey,
  }
}

function imageUrl(path: string | null, size: 'w300' | 'w500' | 'w780' | 'original') {
  if (!path) {
    return ''
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

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

type TmdbPopularResponse = {
  results: TmdbMovie[]
}

type TmdbSearchResponse = {
  results: Array<TmdbMovie & { media_type?: 'movie' | 'tv' | 'person' }>
}

type TmdbGenresResponse = {
  genres: Array<{ id: number; name: string }>
}

type TmdbCreditsResponse = {
  cast: TmdbCast[]
}

type TmdbVideosResponse = {
  results: Array<{
    key: string
    site: string
    type: string
    official?: boolean
  }>
}

function minutesToDuration(runtime: number | undefined) {
  if (!runtime || runtime <= 0) {
    return '--'
  }

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60

  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}

function mapMovieToFilme(movie: TmdbMovie, genresMap: Map<number, string>): Filme {
  const yearText = (movie.release_date || movie.first_air_date || '').slice(0, 4)
  const year = Number(yearText) || new Date().getFullYear()

  const genreNames = movie.genre_ids
    ? movie.genre_ids
        .map((id) => genresMap.get(id))
        .filter((genre): genre is string => Boolean(genre))
    : (movie.genres ?? []).map((genre) => genre.name)

  return {
    id: movie.id,
    title: movie.title || movie.name || 'Sem titulo',
    year,
    rating: Number(movie.vote_average?.toFixed(1)) || 0,
    imageUrl: imageUrl(movie.poster_path, 'w500') || 'https://placehold.co/500x750/404040/FFFFFF?text=Sem+Imagem',
    bannerUrl:
      imageUrl(movie.backdrop_path, 'w780') ||
      imageUrl(movie.poster_path, 'w780') ||
      'https://placehold.co/1200x700/202020/FFFFFF?text=Sem+Banner',
    duration: minutesToDuration(movie.runtime),
    genres: genreNames.length > 0 ? genreNames.join(' • ') : 'Sem genero',
    description: movie.overview || 'Descricao indisponivel.',
    watchUrl: '#',
    cast: [],
  }
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}) {
  const auth = resolveAuthConfig()

  const searchParams = new URLSearchParams({
    language: DEFAULT_LANGUAGE,
    ...params,
  })

  if (auth.mode === 'query') {
    searchParams.set('api_key', auth.apiKey)
  }

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`, {
    headers:
      auth.mode === 'bearer'
        ? {
            Authorization: `Bearer ${auth.token}`,
          }
        : undefined,
  })

  if (!response.ok) {
    throw new Error(`Erro ao buscar TMDB: ${response.status}`)
  }

  return (await response.json()) as T
}

async function loadGenresMap() {
  const [movieGenres, tvGenres] = await Promise.all([
    tmdbFetch<TmdbGenresResponse>('/genre/movie/list'),
    tmdbFetch<TmdbGenresResponse>('/genre/tv/list'),
  ])

  return new Map<number, string>([
    ...movieGenres.genres.map((g): [number, string] => [g.id, g.name]),
    ...tvGenres.genres.map((g): [number, string] => [g.id, g.name]),
  ])
}

export async function fetchPopularMovies() {
  // Fetch both movies and TV popular lists, then merge.
  const [moviePopular, tvPopular, genresMap] = await Promise.all([
    tmdbFetch<TmdbPopularResponse>('/movie/popular'),
    tmdbFetch<TmdbPopularResponse>('/tv/popular'),
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

  // interleave or concat; we'll concat with movies first then tvs
  return [...movies, ...tvs]
}

export async function searchCatalog(query: string) {
  const normalizedQuery = query.trim()
  const searchPages = 5

  if (!normalizedQuery) {
    return [] as Filme[]
  }

  const genresMap = await loadGenresMap()

  const pageRequests = Array.from({ length: searchPages }, (_, index) => String(index + 1))

  const searchPagesResults = await Promise.all(
    pageRequests.map((page) =>
      tmdbFetch<TmdbSearchResponse>('/search/multi', {
        query: normalizedQuery,
        include_adult: 'false',
        page,
      }),
    ),
  )

  const results: Filme[] = searchPagesResults.flatMap((page) =>
    page.results
      .filter(
        (item): item is TmdbMovie & { media_type: 'movie' | 'tv' } =>
          item.media_type === 'movie' || item.media_type === 'tv',
      )
      .map((item) => ({
        ...mapMovieToFilme(item, genresMap),
        mediaType: item.media_type,
      })),
  )

  const unique = new Map<string, Filme>()

  for (const item of results) {
    unique.set(`${item.mediaType ?? 'movie'}:${item.id}`, item)
  }

  return Array.from(unique.values())
}

export async function fetchMovieDetails(movieId: number, mediaType: 'movie' | 'tv' = 'movie') {
  const prefix = mediaType === 'movie' ? 'movie' : 'tv'

  const [details, credits, videos] = await Promise.all([
    tmdbFetch<TmdbMovie>(`/${prefix}/${movieId}`),
    tmdbFetch<TmdbCreditsResponse>(`/${prefix}/${movieId}/credits`),
    tmdbFetch<TmdbVideosResponse>(`/${prefix}/${movieId}/videos`),
  ])

  const trailer = videos.results.find(
    (video) =>
      video.site.toLowerCase() === 'youtube' &&
      video.type.toLowerCase() === 'trailer' &&
      video.key,
  )

  const cast = credits.cast.slice(0, 12).map((actor) => ({
    name: actor.name,
    image: imageUrl(actor.profile_path, 'w300') || 'https://placehold.co/300x400/404040/FFFFFF?text=Sem+Foto',
    character: actor.character || 'Personagem nao informado',
  }))

  return {
    duration: minutesToDuration(details.runtime),
    genres: (details.genres ?? []).map((genre) => genre.name).join(' • ') || 'Sem genero',
    description: details.overview || 'Descricao indisponivel.',
    watchUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '#',
    cast,
  }
}
