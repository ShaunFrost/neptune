import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const SideNavBar = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('', className)} {...props}>
      {children}
    </div>
  )
}

type NavBarItemProps = {
  active?: boolean
} & ComponentProps<'div'>

export const NavBarItem = ({ className, children, active, ...props }: NavBarItemProps) => {
  return (
    <div
      className={twMerge(
        'flex flex-row h-[40px] items-center justify-start rounded-md bg-[#3d3d3d] hover:cursor-pointer p-2 m-2 transition ease-in-out duration-500 hover:bg-[#a1a1a1]' +
          (active ? ' bg-[#b2b2b2]' : ''),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
