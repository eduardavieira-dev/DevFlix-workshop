import { StarIcon } from '@phosphor-icons/react'

export function Card() {
  return (
    <>
      <a href="" className="max-w-xs p-2 flex flex-col gap-2">
        <img src="background.png" alt="" className="rounded-md max-h-100" />
        <h3 className="text-md">Titulo filme/série</h3>
        <div className="text-xs flex items-center gap-2 justify-between text-neutral-300">
          <span>2026</span>
          <span className="flex items-center gap-1">
            <StarIcon weight="fill" className="text-amber-400" /> 7.0
          </span>
        </div>
      </a>
    </>
  )
}
