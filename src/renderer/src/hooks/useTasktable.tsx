import { useAppContext } from '@renderer/store/AppContext'
import { INITIAL_ADD_TASK_DATA } from '@shared/constants'
import { Task } from '@shared/types'
import { useState } from 'react'

export const useTasktable = () => {
  const {
    tasks,
    addTaskData,
    setAddTaskData,
    selectedProject,
    selectedTask,
    setSelectedTask,
    updateProject
  } = useAppContext()

  const [showEditTask, setShowEditTask] = useState(false)

  const handleClick = (task: Task) => {
    const { id, ...taskData } = task
    setSelectedTask(task)
    setAddTaskData(taskData)
    setShowEditTask(true)
  }

  const saveTask = () => {
    if (!selectedProject) return

    if (!selectedTask) return

    const { tasks, ...project } = selectedProject

    const updatedTasks: Task[] = []
    tasks.forEach((task) => {
      if (task.id === selectedTask.id) {
        updatedTasks.push({
          id: selectedTask.id,
          ...addTaskData
        })
      } else {
        updatedTasks.push(task)
      }
    })

    const updatedProject = {
      ...project,
      tasks: updatedTasks
    }

    updateProject(updatedProject)
    setAddTaskData(INITIAL_ADD_TASK_DATA)
  }

  const resetTask = () => {
    setSelectedTask(null)
    setAddTaskData(INITIAL_ADD_TASK_DATA)
  }

  const handleDeleteTask = (id: string) => {
    if (!selectedProject) return
    const updatedTasks = tasks.filter((task) => task.id !== id)

    const updatedProject = {
      ...selectedProject,
      tasks: updatedTasks
    }

    updateProject(updatedProject)
    setAddTaskData(INITIAL_ADD_TASK_DATA)
  }

  return {
    tasks,
    showEditTask,
    setShowEditTask,
    handleClick,
    saveTask,
    resetTask,
    handleDeleteTask
  }
}
