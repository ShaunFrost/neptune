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

export type GetProjects = () => Promise<ProjectType[]>
export type UpdateProject = (updatedProject: ProjectType) => Promise<void>
