import { INITIAL_ADD_PROJECT_DATA, INITIAL_ADD_TASK_DATA } from '@shared/constants'
import {
  AddProjectDataType,
  AddTaskDataType,
  ProjectStatus,
  ProjectType,
  Task
} from '@shared/types'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

type AppContextProviderProps = {
  children: ReactNode
}

interface AppContextType {
  projects: ProjectType[]
  tasks: Task[]
  selectedProject: ProjectType | null
  setSelectedProject: React.Dispatch<React.SetStateAction<ProjectType | null>>
  selectedProjectId: string
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>
  updateProject: (project: ProjectType) => void
  addProjectData: AddProjectDataType
  setAddProjectData: React.Dispatch<React.SetStateAction<AddProjectDataType>>
  addTaskData: AddTaskDataType
  setAddTaskData: React.Dispatch<React.SetStateAction<AddTaskDataType>>
  editSummary: string
  setEditSummary: React.Dispatch<React.SetStateAction<string>>
  editProjectStatus: ProjectStatus
  setEditProjectStatus: React.Dispatch<React.SetStateAction<ProjectStatus>>
  selectedTask: Task | null
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
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
  const [tasks, setTasks] = useState<Task[]>([] as Task[])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)
  const [addProjectData, setAddProjectData] = useState<AddProjectDataType>(INITIAL_ADD_PROJECT_DATA)
  const [addTaskData, setAddTaskData] = useState<AddTaskDataType>(INITIAL_ADD_TASK_DATA)
  const [editSummary, setEditSummary] = useState<string>('')
  const [editProjectStatus, setEditProjectStatus] = useState<ProjectStatus>(ProjectStatus.IDEATING)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const getProject = (projectId: string): ProjectType => {
    if (!projects) return {} as ProjectType
    const savedProject = projects.filter((project) => project.id === projectId)
    return savedProject.length > 0 ? savedProject[0] : ({} as ProjectType)
  }

  const updateProject = (project: ProjectType) => {
    updateProjectFiles(project)
    setSelectedProject(project)
  }

  useEffect(() => {
    loadProjects().then(setProjects)
    console.log('Called')
  }, [])

  useEffect(() => {
    setSelectedProject(getProject(selectedProjectId))
  }, [selectedProjectId])

  useEffect(() => {
    if (selectedProject) {
      setEditSummary(selectedProject.summary)
      setEditProjectStatus(selectedProject.status)
      setTasks(selectedProject.tasks)
    }
  }, [selectedProject])

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        setSelectedProject,
        updateProject,
        addProjectData,
        setAddProjectData,
        addTaskData,
        setAddTaskData,
        editSummary,
        setEditSummary,
        editProjectStatus,
        setEditProjectStatus,
        selectedTask,
        setSelectedTask
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}
