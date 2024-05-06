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
  projectCanvasData: string
  updateProjectCanvas: (canvasData: string) => void
}

const loadProjects = async () => {
  const projects = await window.context.getProjects()
  // sort if required
  return projects
}

const updateProjectFiles = async (project: ProjectType) => {
  await window.context.updateProject(project)
}

const loadProjectCanvasData = async (id: string) => {
  const canvasData = await window.context.getProjectCanvas(id)
  return canvasData
}

const updateProjectCanvasFile = async (id: string, canvasData: string) => {
  await window.context.updateProjectCanvas(id, canvasData)
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
  const [projectCanvasData, setProjectCanvasData] = useState<string>('')

  const getProject = (projectId: string): ProjectType => {
    if (!projects) return {} as ProjectType
    const savedProject = projects.filter((project) => project.id === projectId)
    return savedProject.length > 0 ? savedProject[0] : ({} as ProjectType)
  }

  const updateProject = (project: ProjectType) => {
    updateProjectFiles(project)
    setSelectedProject(project)
  }

  const updateProjectCanvas = (canvasData: string) => {
    updateProjectCanvasFile(selectedProjectId, canvasData)
    setProjectCanvasData(canvasData)
  }

  useEffect(() => {
    loadProjects().then(setProjects)
    console.log('Loading projects!')
  }, [])

  useEffect(() => {
    setSelectedProject(getProject(selectedProjectId))
    loadProjectCanvasData(selectedProjectId).then((data) => setProjectCanvasData(data))
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
        setSelectedTask,
        projectCanvasData,
        updateProjectCanvas
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}
