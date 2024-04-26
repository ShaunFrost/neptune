import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const ProjectLayout = ({ className, children, ...props }: ComponentProps<'main'>) => {
  return (
    <main className={twMerge('flex flex-row h-screen', className)} {...props}>
      {children}
    </main>
  )
}

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  return (
    <aside className={twMerge('w-[250px] mt-10 overflow-scroll mb-2', className)} {...props}>
      {children}
    </aside>
  )
}

export const Content = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge('flex-1 overflow-auto mt-10 mb-2 overflow-y-scroll', className)}
      {...props}
    >
      {children}
    </div>
  )
}
