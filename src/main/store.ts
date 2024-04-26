import * as fsp from 'fs/promises'
import { GetProjects, ProjectType, Task, TaskStatus, UpdateProject } from '@shared/types'
import { homedir } from 'os'
import { APP_DIRECTORY_NAME, FILE_ENCODING } from '@shared/constants'

export const getRootDir = () => {
  return `${homedir()}/${APP_DIRECTORY_NAME}`
}

const getProjectInfo = async (fileName: string) => {
  const projectFilePath = `${getRootDir()}/${fileName}`
  const projectFileData = await fsp.readFile(projectFilePath, { encoding: FILE_ENCODING })
  const projectOnFile = JSON.parse(projectFileData)
  const tasks: Task[] = projectOnFile.tasks
  const project: ProjectType = {
    ...projectOnFile,
    totalTasks: tasks.length,
    completedTasks: tasks.reduce((total, task) => {
      if (task.status === TaskStatus.COMPLETED) {
        return total + 1
      }
      return total
    }, 0)
  }
  return project
}

const writeProjectInfo = async (fileName: string, fileData: string) => {
  const projectFilePath = `${getRootDir()}/${fileName}`
  return fsp.writeFile(projectFilePath, fileData, { encoding: FILE_ENCODING })
}

export const getProjects: GetProjects = async () => {
  const rootDir = getRootDir()
  await fsp.access(rootDir, fsp.constants.F_OK)

  const allFiles = await fsp.readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const projectFileNames = allFiles.filter((file) => file.endsWith('.json'))
  return Promise.all(projectFileNames.map(getProjectInfo))
}

export const updateProject: UpdateProject = async (updatedProject: ProjectType) => {
  const fileName = `${updatedProject.id}.json`
  const { completedTasks, totalTasks, ...dataToWrite } = updatedProject
  const updatedData = JSON.stringify(dataToWrite)
  await writeProjectInfo(fileName, updatedData)
}
