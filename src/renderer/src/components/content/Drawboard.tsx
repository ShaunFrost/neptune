import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { SketchPad } from '../Sketchpad'

export const Drawboard = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('p-4 text-2xl h-full w-full', className)} {...props}>
      <SketchPad />
    </div>
  )
}
