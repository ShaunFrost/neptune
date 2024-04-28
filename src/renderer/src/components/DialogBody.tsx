import { useAppContext } from '@renderer/store/AppContext'
import { ProjectStatus, TaskPriority, TaskStatus } from '@shared/types'

export const AddProjectModalBody = () => {
  const { addProjectData, setAddProjectData } = useAppContext()
  const handleChange = (e) => {
    const propertyName = e.target.name
    setAddProjectData((prev) => (prev = { ...prev, [propertyName]: e.target.value }))
  }
  return (
    <>
      <div className="mt-2 flex flex-row items-center justify-center text-black">
        <label htmlFor="projectName">Name</label>
        <input
          className="ml-2"
          name="name"
          id="projectName"
          value={addProjectData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mt-2 flex flex-row items-center justify-center text-black">
        <label htmlFor="projectStatus">Status</label>
        <select
          className="ml-2"
          name="status"
          id="projectStatus"
          value={addProjectData.status}
          onChange={handleChange}
        >
          {Object.values(ProjectStatus).map((status) => {
            return (
              <option key={status} value={status}>
                {status}
              </option>
            )
          })}
        </select>
      </div>
      <div className="mt-2 flex flex-row items-center justify-center text-black">
        <label htmlFor="projectSummary">Summary</label>
        <textarea
          className="ml-2 resize-none"
          id="projectSummary"
          name="summary"
          rows={5}
          cols={40}
          value={addProjectData.summary}
          onChange={handleChange}
        />
      </div>
    </>
  )
}

export const AddTaskModalBody = () => {
  const { addTaskData, setAddTaskData } = useAppContext()
  const handleChange = (e) => {
    const propertyName = e.target.name
    setAddTaskData((prev) => (prev = { ...prev, [propertyName]: e.target.value }))
  }

  return (
    <>
      <div className="mt-2 flex flex-row items-center justify-center text-black">
        <label htmlFor="taskItem">Task</label>
        <input
          className="ml-2"
          name="taskItem"
          id="taskItem"
          value={addTaskData.taskItem}
          onChange={handleChange}
        />
      </div>
      <div className="mt-2 flex flex-row items-center justify-center text-black">
        <label htmlFor="status">Status</label>
        <select
          className="ml-2"
          name="status"
          id="status"
          value={addTaskData.status}
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
          value={addTaskData.priority}
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
    </>
  )
}

export const EditSummaryModalBody = () => {
  const { editSummary, setEditSummary } = useAppContext()
  const handleChange = (e) => {
    setEditSummary(e.target.value)
  }

  return (
    <div className="flex items-center justify-center text-black">
      <textarea rows={10} cols={30} value={editSummary} onChange={handleChange} />
    </div>
  )
}

export const EditProjectStatusModalBody = () => {
  const { editProjectStatus, setEditProjectStatus } = useAppContext()
  const handleChange = (e) => {
    setEditProjectStatus(e.target.value)
  }

  return (
    <div className="flex items-center justify-center text-black">
      <label htmlFor="status">Status</label>
      <select
        className="ml-2"
        name="status"
        id="projectStatus"
        value={editProjectStatus}
        onChange={handleChange}
      >
        {Object.values(ProjectStatus).map((status) => {
          return (
            <option key={status} value={status}>
              {status}
            </option>
          )
        })}
      </select>
    </div>
  )
}
