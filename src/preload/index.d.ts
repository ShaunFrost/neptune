import {
  DeleteProjectFiles,
  GetProjectCanvas,
  GetProjectMarkdown,
  GetProjects,
  UpdateProject,
  UpdateProjectCanvas,
  UpdateProjectMarkdown
} from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      getProjects: GetProjects
      updateProject: UpdateProject
      getProjectCanvas: GetProjectCanvas
      updateProjectCanvas: UpdateProjectCanvas
      getProjectMarkdown: GetProjectMarkdown
      updateProjectMarkdown: UpdateProjectMarkdown
      deleteProjectFiles: DeleteProjectFiles
    }
  }
}
