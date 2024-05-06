import * as fsp from 'fs/promises'
import {
  GetProjectCanvas,
  GetProjects,
  ProjectType,
  Task,
  TaskStatus,
  UpdateProject,
  UpdateProjectCanvas
} from '@shared/types'
import { homedir } from 'os'
import { APP_DIRECTORY_NAME, FILE_ENCODING } from '@shared/constants'

export const getRootDir = () => {
  return `${homedir()}/${APP_DIRECTORY_NAME}`
}

const getFileData = async (fileName: string) => {
  const filePath = `${getRootDir()}/${fileName}`
  const fileData = await fsp.readFile(filePath, { encoding: FILE_ENCODING })
  return fileData
}

const getProjectInfo = async (fileName: string) => {
  const projectFileData = await getFileData(fileName)
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

const writeDataToFile = async (fileName: string, fileData: string) => {
  const filePath = `${getRootDir()}/${fileName}`
  return fsp.writeFile(filePath, fileData, { encoding: FILE_ENCODING })
}

export const getProjects: GetProjects = async () => {
  const rootDir = getRootDir()
  await fsp.access(rootDir, fsp.constants.F_OK)

  const allFiles = await fsp.readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const projectFileNames = allFiles.filter(
    (file) => file.endsWith('.json') && !file.startsWith('canvas')
  )
  return Promise.all(projectFileNames.map(getProjectInfo))
}

export const updateProject: UpdateProject = async (updatedProject: ProjectType) => {
  const fileName = `${updatedProject.id}.json`
  const { completedTasks, totalTasks, ...dataToWrite } = updatedProject
  const updatedData = JSON.stringify(dataToWrite)
  await writeDataToFile(fileName, updatedData)
}

const getCanvasFile = async (fileName: string) => {
  const projectFileData = await getFileData(fileName)
  return projectFileData
}

export const getProjectCanvas: GetProjectCanvas = async (id) => {
  const rootDir = getRootDir()
  await fsp.access(rootDir, fsp.constants.F_OK)
  const allFiles = await fsp.readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const canvasFileName = allFiles.find(
    (file) => file.startsWith('canvas_') && file.includes(id) && file.endsWith('.json')
  )

  const data = canvasFileName ? await getCanvasFile(canvasFileName) : ''
  return data
}

export const updateProjectCanvas: UpdateProjectCanvas = async (id: string, canvasData: string) => {
  const fileName = `canvas_${id}.json`
  await writeDataToFile(fileName, canvasData)
}
