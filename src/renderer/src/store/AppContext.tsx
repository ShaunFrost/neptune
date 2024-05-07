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
  markdownContent: string
  updateProjectMarkdown: (markdownContent: string) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addNewProject: (project: ProjectType) => void
}

const loadProjects = async () => {
  const projects = await window.context.getProjects()
  // sort if required
  return projects
}

const deleteProjectFiles = async (id: string) => {
  await window.context.deleteProjectFiles(id)
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

const loadProjectMarkdownData = async (id: string) => {
  const projectMarkdown = await window.context.getProjectMarkdown(id)
  return projectMarkdown === '' ? '# Jot down' : projectMarkdown
}

const updateProjectMarkdownFile = async (id: string, markdownContent: string) => {
  await window.context.updateProjectMarkdown(id, markdownContent)
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
  const [markdownContent, setMarkdownContent] = useState<string>('')

  const getProject = (projectId: string): ProjectType => {
    if (!projects) return {} as ProjectType
    const savedProject = projects.filter((project) => project.id === projectId)
    return savedProject.length > 0 ? savedProject[0] : ({} as ProjectType)
  }

  const updateProject = (project: ProjectType) => {
    updateProjectFiles(project)
    setSelectedProject(project)
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === project.id) {
          return project
        }
        return p
      })
    )
  }

  const addNewProject = (project: ProjectType) => {
    updateProjectFiles(project)
    setProjects((prev) => [...prev, project])
  }

  const updateProjectCanvas = (canvasData: string) => {
    updateProjectCanvasFile(selectedProjectId, canvasData)
    setProjectCanvasData(canvasData)
  }

  const updateProjectMarkdown = async (markdownContent: string) => {
    await updateProjectMarkdownFile(selectedProjectId, markdownContent)
    setMarkdownContent(markdownContent)
  }

  const deleteProject = async (id: string) => {
    await deleteProjectFiles(id)
    setProjects(projects.filter((project) => project.id !== id))
  }

  useEffect(() => {
    loadProjects().then(setProjects)
    console.log('Loading projects!')
  }, [])

  useEffect(() => {
    setSelectedProject(getProject(selectedProjectId))
    loadProjectCanvasData(selectedProjectId).then((data) => setProjectCanvasData(data))
    loadProjectMarkdownData(selectedProjectId).then((data) => setMarkdownContent(data))
  }, [selectedProjectId])

  useEffect(() => {
    if (selectedProject) {
      setEditSummary(selectedProject.summary)
      setEditProjectStatus(selectedProject.status)
      setTasks(selectedProject.tasks)
    }
  }, [selectedProject])

  useEffect(() => {
    console.log('Projects changed', projects)
  }, [projects])

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
        updateProjectCanvas,
        markdownContent,
        updateProjectMarkdown,
        deleteProject,
        addNewProject
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext)
}
