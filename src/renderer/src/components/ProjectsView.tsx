import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { IoSearchCircle } from 'react-icons/io5'
import { RiCodeBoxFill } from 'react-icons/ri'
import { ImBin } from 'react-icons/im'
import { IconContext } from 'react-icons'
import Pie from './Pie'
import { ProjectType, TaskStatus } from '@shared/types'

type ProjectCardProps = {
  project: ProjectType
} & ComponentProps<'div'>

export const ProjectsView = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('flex flex-col h-screen', className)} {...props}>
      {children}
    </div>
  )
}

type SearchBarProps = {
  setShowAddDialog: React.Dispatch<React.SetStateAction<boolean>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
} & ComponentProps<'div'>

export const SearchBar = ({
  className,
  setShowAddDialog,
  searchQuery,
  setSearchQuery,
  ...props
}: SearchBarProps) => {
  return (
    <div className={twMerge('mt-10 h-12 flex justify-center items-center', className)} {...props}>
      <input
        type="text"
        className="rounded-full pl-3 pr-3 pt-1 pb-1 text-black"
        placeholder="Search project..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <IconContext.Provider value={{ size: '2rem' }}>
        <IoSearchCircle />
      </IconContext.Provider>
      <div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-2 py-1 ml-4 rounded-md border border-zinc-400/50 bg-sky-400 hover:bg-sky-600 text-sm"
        >
          Create Project
        </button>
      </div>
    </div>
  )
}

export const ProjectsGrid = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge(
        'grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] overflow-y-auto h-screen mt-4 gap-4 p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const ProjectNotFound = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center h-16 w-[100%] mt-4 p-4',
        className
      )}
      {...props}
    >
      Project not found
    </div>
  )
}

export const ProjectCard = ({ className, project, ...props }: ProjectCardProps) => {
  const totalTasks = project.tasks.length
  const completedTasks = project.tasks.reduce((total, task) => {
    if (task.status === TaskStatus.COMPLETED) {
      return total + 1
    }
    return total
  }, 0)
  const taskPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return (
    <div
      className={twMerge('min-h-[250px] min-w-[350px] rounded-lg hover:cursor-pointer', className)}
      {...props}
    >
      <div className="p-2 flex flex-col relative">
        <div className="flex flex-row h-16 justify-start items-center">
          <IconContext.Provider value={{ size: '4rem' }}>
            <RiCodeBoxFill />
          </IconContext.Provider>
          <span className="ml-1 text-3xl font-jersey">{project.name}</span>
        </div>
        <p className="mt-1 ml-1 font-anton text-xl">Status: {project.status}</p>
        <div className="mt-2 flex flex-row justify-center items-center h-[100px]">
          <Pie percentage={taskPercentage} color="blue" />
          <span className="font-anton text-xl">
            {completedTasks}/{totalTasks} tasks
          </span>
        </div>
      </div>
    </div>
  )
}
