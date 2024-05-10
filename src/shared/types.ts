export enum TaskStatus {
  TODO = 'To-Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Done'
}

export enum TaskPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High'
}

export type Task = {
  id: string
  taskItem: string
  status: TaskStatus
  priority: TaskPriority
}

export enum ProjectStatus {
  IDEATING = 'Ideating',
  BUILDING = 'Building',
  DEPLOYED = 'Deployed'
}

export type ProjectType = {
  id: string
  name: string
  status: ProjectStatus
  completedTasks: number
  totalTasks: number
  tasks: Task[]
  summary: string
}

export type AddProjectDataType = {
  name: string
  status: ProjectStatus
  summary: string
}

export type AddTaskDataType = {
  taskItem: string
  status: TaskStatus
  priority: TaskPriority
}

export type GetProjects = () => Promise<ProjectType[]>
export type UpdateProject = (updatedProject: ProjectType) => Promise<void>
export type GetProjectCanvas = (id: string) => Promise<string>
export type UpdateProjectCanvas = (id: string, canvasData: string) => Promise<void>
export type GetProjectMarkdown = (id: string) => Promise<string>
export type UpdateProjectMarkdown = (id: string, markdownContent: string) => Promise<void>
export type DeleteProjectFiles = (id: string) => Promise<void[]>

export enum ANIMATIONS {
  SLIDE_FROM_RIGHT = 'slideFromRight',
  SCALE_FROM_MIDDLE = 'scaleFromMiddle',
  APPEAR_DISSAPEAR = 'opacityOnly'
}
