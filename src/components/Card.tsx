import { StarIcon } from '@phosphor-icons/react'

type CardProps = {
  title: string
  year: number
  rating: number
  bannerUrl: string
}

export function Card({ title, year, rating, bannerUrl }: CardProps) {
  return (
    <>
      <div className="max-w-xs p-2 flex flex-col gap-2 w-full">
        <img
          src={bannerUrl}
          alt=""
          onError={(e) => {
            e.currentTarget.src =
              'https://placehold.co/270x150/404040/FFFFFF?text=Sem+Imagem'
          }}
          className="rounded-md max-h-100 max-w-65"
        />

        <h3 className="text-md">{title}</h3>

        <div className="text-xs flex items-center gap-2 justify-between text-neutral-300">
          <span>{year}</span>

          <span className="flex items-center gap-1">
            <StarIcon weight="fill" className="text-amber-400" />
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </>
  )
}