import { useTask } from '@renderer/hooks/useTask'
import { Modal } from '../Dialog'
import { AddTaskModalBody } from '../DialogBody'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTasktable } from '@renderer/hooks/useTasktable'
import { ImBin } from 'react-icons/im'

type TasksProps = ComponentProps<'div'>

export const Tasks = ({ className, ...props }: TasksProps) => {
  const { tasks, showAddDialog, setShowAddDialog, resetTaskFields, addTask } = useTask()

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

const TaskTable = () => {
  const {
    tasks,
    showEditTask,
    setShowEditTask,
    handleClick,
    saveTask,
    resetTask,
    handleDeleteTask
  } = useTasktable()

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
