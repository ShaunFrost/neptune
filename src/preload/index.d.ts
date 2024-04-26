import { GetProjects, UpdateProject } from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      getProjects: GetProjects
      updateProject: UpdateProject
    }
  }
}
