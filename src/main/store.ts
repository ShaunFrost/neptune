import * as fsp from 'fs/promises'
import {
  DeleteProjectFiles,
  GetProjectCanvas,
  GetProjectMarkdown,
  GetProjects,
  ProjectType,
  Task,
  TaskStatus,
  UpdateProject,
  UpdateProjectCanvas,
  UpdateProjectMarkdown
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

const deleteFile = async (fileName: string) => {
  const filePath = `${getRootDir()}/${fileName}`
  await fsp.rm(filePath)
}

export const deleteProjectFiles: DeleteProjectFiles = async (id: string) => {
  const rootDir = getRootDir()

  const allFiles = await fsp.readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const allProjectFileNames = allFiles.filter((file) => file.includes(id))

  return Promise.all(allProjectFileNames.map((file) => deleteFile(file)))
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

export const getProjectMarkdown: GetProjectMarkdown = async (id) => {
  const rootDir = getRootDir()
  await fsp.access(rootDir, fsp.constants.F_OK)
  const allFiles = await fsp.readdir(rootDir, {
    encoding: FILE_ENCODING,
    withFileTypes: false
  })

  const markdownFileName = allFiles.find((file) => file.includes(id) && file.endsWith('.md'))

  const data = markdownFileName ? await getFileData(markdownFileName) : ''
  return data
}

export const updateProjectMarkdown: UpdateProjectMarkdown = async (
  id: string,
  markdownContent: string
) => {
  const fileName = `${id}.md`
  await writeDataToFile(fileName, markdownContent)
}
