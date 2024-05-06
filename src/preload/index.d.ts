import { GetProjectCanvas, GetProjects, UpdateProject, UpdateProjectCanvas } from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      getProjects: GetProjects
      updateProject: UpdateProject
      getProjectCanvas: GetProjectCanvas
      updateProjectCanvas: UpdateProjectCanvas
    }
  }
}
