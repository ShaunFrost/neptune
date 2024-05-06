import { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { LiaEdit } from 'react-icons/lia'
import { ImBin } from 'react-icons/im'
import { Task } from '@shared/types'
import { useAppContext } from '@renderer/store/AppContext'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { Modal } from './Dialog'
import { AddTaskModalBody, EditProjectStatusModalBody, EditSummaryModalBody } from './DialogBody'
import { INITIAL_ADD_TASK_DATA } from '@shared/constants'
import { SketchPad } from './Sketchpad'
import MarkdownEditor from './MarkdownEditor'

type OverviewProps = ComponentProps<'div'>

type TasksProps = ComponentProps<'div'>

export const Overview = ({ className, ...props }: OverviewProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const {
    selectedProject,
    editSummary,
    updateProject,
    setEditSummary,
    editProjectStatus,
    setEditProjectStatus
  } = useAppContext()
  const resetSummary = () => {
    setEditSummary(selectedProject!.summary)
  }
  const saveSummary = () => {
    if (!selectedProject) return

    if (!editSummary) {
      toast.error('Summary is empty!', {
        position: 'bottom-center',
        duration: 1500
      })
      return
    }

    const updatedProject = {
      ...selectedProject,
      summary: editSummary
    }

    updateProject(updatedProject)
  }
  const [showEditStatusDialog, setShowEditStatusDialog] = useState(false)
  const resetStatus = () => {
    setEditProjectStatus(selectedProject!.status)
  }
  const saveStatus = () => {
    if (!selectedProject) return

    const updatedProject = {
      ...selectedProject,
      status: editProjectStatus
    }

    updateProject(updatedProject)
  }
  return (
    <div className={twMerge('p-4', className)} {...props}>
      <div className="font-anton text-5xl">Overview</div>
      <div className="font-anton mt-4 p-4 h-[300px] overflow-y-scroll rounded-md bg-black flex flex-col">
        <div className="flex flex-row justify-between">
          <span className="text-4xl">Summary</span>
          <div className="text-2xl hover:cursor-pointer" onClick={() => setShowSaveDialog(true)}>
            <LiaEdit />
          </div>
        </div>
        <div className="mt-4 text-xl">{selectedProject!.summary}</div>
      </div>
      <div className="font-anton mt-4 p-4 h-[150px] overflow-y-scroll rounded-md bg-black flex flex-col">
        <div className="flex flex-row justify-between">
          <span className="text-4xl">Status</span>
          <div
            className="text-2xl hover:cursor-pointer"
            onClick={() => setShowEditStatusDialog(true)}
          >
            <LiaEdit />
          </div>
        </div>
        <div className="mt-4 text-xl">{selectedProject!.status}</div>
      </div>
      {showSaveDialog ? (
        <Modal
          setShow={setShowSaveDialog}
          heading="Edit Summary"
          save={saveSummary}
          reset={resetSummary}
        >
          <EditSummaryModalBody />
        </Modal>
      ) : (
        <></>
      )}
      {showEditStatusDialog ? (
        <Modal
          setShow={setShowEditStatusDialog}
          heading="Edit Status"
          save={saveStatus}
          reset={resetStatus}
        >
          <EditProjectStatusModalBody />
        </Modal>
      ) : (
        <></>
      )}
    </div>
  )
}

const TaskTable = () => {
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
    // console.log("Remove clicked", id, selectedProject)

    if (!selectedProject) return
    const updatedTasks = tasks.filter((task) => task.id !== id)

    const updatedProject = {
      ...selectedProject,
      tasks: updatedTasks
    }

    updateProject(updatedProject)
    setAddTaskData(INITIAL_ADD_TASK_DATA)
  }

  return (
    <div className="mt-4 bg-black rounded-lg p-4">
      <table className="table-auto w-[100%] rounded-lg bg-[#3d3d3d] border-collapse">
        <thead className="text-left text-xl">
          <tr>
            <th className="p-2">Task</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Priority</th>
            <th className="p-2 text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            return (
              <tr key={task.id} className="transition ease-in-out duration-500 hover:bg-[#b2b2b2]">
                <td
                  className="pt-1 pb-1 pl-2 pr-2 hover:cursor-pointer"
                  onClick={() => handleClick(task)}
                >
                  {task.taskItem}
                </td>
                <td className="pt-1 pb-1 pl-2 pr-2 text-center">{task.status}</td>
                <td className="pt-1 pb-1 pl-2 pr-2 text-center">{task.priority}</td>
                <td className="pt-1 pb-1 pl-2 pr-2 text-center">
                  <button
                    className="bg-red-400 p-1 rounded-lg"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <ImBin />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="h-[10px]" />
      </table>
      {showEditTask ? (
        <Modal setShow={setShowEditTask} heading="Edit Task" save={saveTask} reset={resetTask}>
          <AddTaskModalBody />
        </Modal>
      ) : (
        <></>
      )}
    </div>
  )
}

const TaskNotFound = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={twMerge('flex-1 overflow-auto mt-10 mb-2 overflow-y-scroll', className)}
      {...props}
    >
      <div className="mt-4 bg-black rounded-lg p-4 text-center">No Tasks</div>
    </div>
  )
}

export const Tasks = ({ className, ...props }: TasksProps) => {
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

  return (
    <div className={twMerge('p-4', className)} {...props}>
      <div className="flex flex-row justify-between">
        <div className="font-anton text-4xl">Tasks</div>
        <button
          className="px-2 py-1 ml-4 rounded-md border border-zinc-400/50 bg-sky-400 hover:bg-sky-600 text-sm"
          onClick={() => setShowAddDialog(true)}
        >
          Add Task
        </button>
      </div>
      {tasks.length > 0 ? <TaskTable /> : <TaskNotFound />}
      {showAddDialog ? (
        <Modal setShow={setShowAddDialog} heading="New Task" save={addTask} reset={resetTaskFields}>
          <AddTaskModalBody />
        </Modal>
      ) : (
        <></>
      )}
    </div>
  )
}

export const Drawboard = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('p-4 text-2xl h-full w-full', className)} {...props}>
      <SketchPad />
    </div>
  )
}

export const Notes = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('p-4 h-full w-full', className)} {...props}>
      <MarkdownEditor />
    </div>
  )
}
