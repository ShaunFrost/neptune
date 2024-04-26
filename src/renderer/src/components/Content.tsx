import { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { LiaEdit } from 'react-icons/lia'
import { Task, TaskPriority, TaskStatus } from '@shared/types'
import { useAppContext } from '@renderer/store/AppContext'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

type OverviewProps = ComponentProps<'div'>

type TaskTableProps = {
  tasks: Task[]
}

type TasksProps = TaskTableProps & ComponentProps<'div'>

export const Overview = ({ className, ...props }: OverviewProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const { selectedProject } = useAppContext()
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
      {showSaveDialog ? <SaveModal setShowSaveDialog={setShowSaveDialog} /> : <></>}
    </div>
  )
}

const TaskTable = ({ tasks }: TaskTableProps) => {
  return (
    <div className="mt-4 bg-black rounded-lg p-4">
      <table className="table-auto w-[100%] rounded-lg bg-[#3d3d3d] border-collapse">
        <thead className="text-left text-xl">
          <tr>
            <th className="p-2">Task</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            return (
              <tr key={task.id} className="transition ease-in-out duration-500 hover:bg-[#b2b2b2]">
                <td className="pt-1 pb-1 pl-2 pr-2">{task.taskItem}</td>
                <td className="pt-1 pb-1 pl-2 pr-2 text-center">{task.status}</td>
                <td className="pt-1 pb-1 pl-2 pr-2 text-center">{task.priority}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="h-[10px]" />
      </table>
    </div>
  )
}

export const Tasks = ({ className, tasks, ...props }: TasksProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false)
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
      <TaskTable tasks={tasks} />
      {showAddDialog ? <AddTaskModal setShowAddDialog={setShowAddDialog} /> : <></>}
    </div>
  )
}

export const Drawboard = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('p-4 text-2xl', className)} {...props}>
      <div className="flex flex-col justify-center items-center">
        Drawing board
      </div>
    </div>
  )
}

type ModalProps = {
  setShowSaveDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const SaveModal = ({ setShowSaveDialog }: ModalProps) => {
  const { selectedProject, updateProject } = useAppContext()
  const [edited, setEdited] = useState(selectedProject!.summary)
  const handleEditChange = (e) => {
    setEdited(e.target.value)
  }
  const handleSave = () => {
    if (selectedProject) {
      const updatedProject = { ...selectedProject, summary: edited }
      updateProject(updatedProject)
    }
    setShowSaveDialog(false)
  }
  return (
    <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-black grid place-items-center">
      <div className="w-[70%] bg-[#b2b2b2] h-[80%] rounded-2xl flex flex-col p-[20px] absolute overflow-y-scroll">
        <div className="flex items-center justify-center text-black">
          <textarea rows={5} cols={20} value={edited} onChange={handleEditChange} />
        </div>
        <div className="flex flex-row justify-evenly">
          <button className="bg-blue-300" onClick={handleSave}>
            Save
          </button>
          <button className="bg-blue-300" onClick={() => setShowSaveDialog(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

type AddTaskModalProps = {
  setShowAddDialog: React.Dispatch<React.SetStateAction<boolean>>
}

type AddTaskInputType = {
  taskItem: string
  status: TaskStatus
  priority: TaskPriority
}

const AddTaskModal = ({ setShowAddDialog }: AddTaskModalProps) => {
  const [data, setData] = useState<AddTaskInputType>({
    taskItem: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.NORMAL
  })
  const { updateProject, selectedProject } = useAppContext()
  const handleChange = (e) => {
    const propertyName = e.target.name
    setData((prev) => (prev = { ...prev, [propertyName]: e.target.value }))
  }
  const handleSave = () => {
    if (!data.taskItem) {
      toast.error('Task item should not be empty!', {
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
      ...data
    }

    const { tasks, ...project } = selectedProject
    tasks.push(newTask)

    const updatedProject = {
      ...project,
      tasks
    }

    updateProject(updatedProject)
    setShowAddDialog(false)
  }
  return (
    <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-black grid place-items-center">
      <div className="w-[70%] bg-[#b2b2b2] h-[80%] rounded-2xl flex flex-col p-[20px] absolute overflow-y-scroll">
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center text-black text-2xl mb-2">New Task</div>
          <div className="mt-2 flex flex-row items-center justify-center text-black">
            <label htmlFor="taskItem">Task</label>
            <input
              className="ml-2"
              name="taskItem"
              id="taskItem"
              value={data.taskItem}
              onChange={handleChange}
            />
          </div>
          <div className="mt-2 flex flex-row items-center justify-center text-black">
            <label htmlFor="status">Status</label>
            <select
              className="ml-2"
              name="status"
              id="status"
              value={data.status}
              onChange={handleChange}
            >
              {Object.values(TaskStatus).map((status) => {
                return (
                  <option key={status} value={status}>
                    {status}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="mt-2 flex flex-row items-center justify-center text-black">
            <label htmlFor="priority">Priority</label>
            <select
              className="ml-2"
              name="priority"
              id="priority"
              value={data.priority}
              onChange={handleChange}
            >
              {Object.values(TaskPriority).map((status) => {
                return (
                  <option key={status} value={status}>
                    {status}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="mt-4 flex flex-row w-[100%] justify-evenly">
            <button className="bg-blue-300" onClick={handleSave}>
              Save
            </button>
            <button className="bg-blue-300" onClick={() => setShowAddDialog(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
