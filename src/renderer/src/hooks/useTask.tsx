import { useAppContext } from '@renderer/store/AppContext'
import { INITIAL_ADD_TASK_DATA } from '@shared/constants'
import { Task } from '@shared/types'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

export const useTask = () => {
  const [showAddDialog, setShowAddDialog] = useState(false)

  const { tasks, addTaskData, setAddTaskData, selectedProject, updateProject } = useAppContext()

  const resetTaskFields = () => {
    setAddTaskData(INITIAL_ADD_TASK_DATA)
  }

  const addTask = () => {
    if (!addTaskData.taskItem) {
      toast.error('Task item required!', {
        position: 'bottom-center',
        duration: 1500
      })
      return
    }

    if (!selectedProject) {
      return
    }

    const newTask: Task = {
      id: uuidv4(),
      ...addTaskData
    }

    const { tasks: projectTasks, ...project } = selectedProject
    projectTasks.push(newTask)

    const updatedProject = {
      ...project,
      tasks: projectTasks
    }
    updateProject(updatedProject)
    resetTaskFields()
  }

  return {
    tasks,
    showAddDialog,
    setShowAddDialog,
    resetTaskFields,
    addTask
  }
}
