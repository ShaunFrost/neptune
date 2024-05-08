import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import MarkdownEditor from '../MarkdownEditor'
import TransitionComponent from '../TransitionComponent'

export const Notes = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <TransitionComponent>
      <div className={twMerge('p-4 h-full w-full', className)} {...props}>
        <MarkdownEditor />
      </div>
    </TransitionComponent>
  )
}
