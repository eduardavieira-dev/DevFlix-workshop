export type CastMember = {
  name: string
  image: string
  character: string
}

export type Filme = {
  id: number
  title: string
  year: number
  rating: number
  imageUrl: string
  bannerUrl: string
  duration: string
  genres: string
  description: string
  watchUrl: string
  cast: CastMember[]
  mediaType?: 'movie' | 'tv'
}
