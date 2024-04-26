import { ProjectType, Task } from '@shared/types'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

type AppContextProviderProps = {
  children: ReactNode
}

interface AppContextType {
  projects: ProjectType[]
  selectedProject: ProjectType | null
  selectedProjectId: string
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>
  updateProject: (project: ProjectType) => void
}

const loadProjects = async () => {
  const projects = await window.context.getProjects()
  // sort if required
  return projects
}

const updateProjectFiles = async (project: ProjectType) => {
  await window.context.updateProject(project)
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [projects, setProjects] = useState<ProjectType[]>([] as ProjectType[])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)

  const getProject = (projectId: string): ProjectType => {
    if (!projects) return {} as ProjectType
    const savedProject = projects.filter((project) => project.id === projectId)
    return savedProject.length > 0 ? savedProject[0] : ({} as ProjectType)
  }

  const updateProject = (project: ProjectType) => {
    updateProjectFiles(project)
    setSelectedProject(project)
    setProjects([])
  }

  useEffect(() => {
    loadProjects().then(setProjects)
  }, [projects])

  useEffect(() => {
    setSelectedProject(getProject(selectedProjectId))
  }, [selectedProjectId])

  return (
    <AppContext.Provider
      value={{ projects, selectedProjectId, setSelectedProjectId, selectedProject, updateProject }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}
