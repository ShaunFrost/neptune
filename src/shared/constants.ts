import { ProjectStatus, TaskPriority, TaskStatus } from './types'

export const APP_DIRECTORY_NAME = 'Neptune'
export const FILE_ENCODING = 'utf8'

export const DUMMY_PROJECT = {
  abcde: {
    id: 'abcde',
    name: 'Neptune',
    status: 'Deployed',
    completedTasks: 1,
    totalTasks: 2,
    tasks: [
      {
        id: 'ab123',
        taskItem: 'Code the basic working prototype',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH
      },
      {
        id: 'ab124',
        taskItem: 'Create the logo',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.NORMAL
      }
    ],
    summary: `Dummiest of the dummy apps. No clue why I made this. Is electron better than Tauri? Let's find out soon.`
  }
}

export const INITIAL_ADD_PROJECT_DATA = {
  name: '',
  status: ProjectStatus.IDEATING,
  summary: ''
}

export const INITIAL_ADD_TASK_DATA = {
  taskItem: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.NORMAL
}
