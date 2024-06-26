import {
  GetProjects,
  UpdateProject,
  GetProjectCanvas,
  UpdateProjectCanvas,
  GetProjectMarkdown,
  UpdateProjectMarkdown,
  DeleteProjectFiles
} from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
// const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
// if (process.contextIsolated) {
//   try {
//     contextBridge.exposeInMainWorld('electron', electronAPI)
//     contextBridge.exposeInMainWorld('api', api)
//   } catch (error) {
//     console.error(error)
//   }
// } else {
//   // @ts-ignore (define in dts)
//   window.electron = electronAPI
//   // @ts-ignore (define in dts)
//   window.api = api
// }

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the browser window')
}

try {
  contextBridge.exposeInMainWorld('context', {
    //TODO
    locale: navigator.language,
    getProjects: (...args: Parameters<GetProjects>) =>
      ipcRenderer.invoke('FETCH_PROJECTS', ...args),
    updateProject: (...args: Parameters<UpdateProject>) =>
      ipcRenderer.invoke('WRITE_DATA', ...args),
    getProjectCanvas: (...args: Parameters<GetProjectCanvas>) =>
      ipcRenderer.invoke('FETCH_PROJECT_CANVAS', ...args),
    updateProjectCanvas: (...args: Parameters<UpdateProjectCanvas>) =>
      ipcRenderer.invoke('UPDATE_PROJECT_CANVAS', ...args),
    getProjectMarkdown: (...args: Parameters<GetProjectMarkdown>) =>
      ipcRenderer.invoke('FETCH_PROJECT_MARKDOWN', ...args),
    updateProjectMarkdown: (...args: Parameters<UpdateProjectMarkdown>) =>
      ipcRenderer.invoke('UPDATE_PROJECT_MARKDOWN', ...args),
    deleteProjectFiles: (...args: Parameters<DeleteProjectFiles>) =>
      ipcRenderer.invoke('DELETE_PROJECT', ...args)
  })
} catch (error) {
  console.error(error)
}
