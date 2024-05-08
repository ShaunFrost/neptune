import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { SketchPad } from '../Sketchpad'
import TransitionComponent from '../TransitionComponent'

export const Drawboard = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <TransitionComponent>
      <div className={twMerge('p-4 text-2xl h-full w-full', className)} {...props}>
        <SketchPad />
      </div>
    </TransitionComponent>
  )
}
