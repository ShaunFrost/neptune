import { ProjectsView, SearchBar, ProjectsGrid, ProjectCard } from '../components'
import { Link } from 'react-router-dom'
import { useAppContext } from '@renderer/store/AppContext'
import { useState } from 'react'
import { ProjectStatus, ProjectType } from '@shared/types'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

const Home = () => {
  const { projects } = useAppContext()
  const [showAddDialog, setShowAddDialog] = useState(false)
  return (
    <ProjectsView className="relative">
      <SearchBar setShowAddDialog={setShowAddDialog} />
      <ProjectsGrid>
        {[...projects.values()].map((project) => {
          return (
            <div key={project.id}>
              <Link to={`/projects/${project.id}`}>
                <ProjectCard project={project} className="bg-[#1a1a1a] shadow-md shadow-black" />
              </Link>
            </div>
          )
        })}
      </ProjectsGrid>
      {showAddDialog ? <AddProjectModal setShowAddDialog={setShowAddDialog} /> : <></>}
    </ProjectsView>
  )
}

export default Home

type AddProjectModalProps = {
  setShowAddDialog: React.Dispatch<React.SetStateAction<boolean>>
}

type AddProjectInputType = {
  name: string
  status: ProjectStatus
  summary: string
}

const AddProjectModal = ({ setShowAddDialog }: AddProjectModalProps) => {
  const [data, setData] = useState<AddProjectInputType>({
    name: '',
    status: ProjectStatus.IDEATING,
    summary: ''
  })
  const { updateProject } = useAppContext()
  const handleChange = (e) => {
    const propertyName = e.target.name
    setData((prev) => (prev = { ...prev, [propertyName]: e.target.value }))
  }
  const handleSave = () => {
    if (!data.name || !data.summary) {
      toast.error('Name and summary should not be empty!', {
        position: 'bottom-center',
        duration: 1500
      })
      return
    }

    const newProject: ProjectType = {
      id: uuidv4(),
      ...data,
      completedTasks: 0,
      totalTasks: 0,
      tasks: []
    }
    updateProject(newProject)
    setShowAddDialog(false)
  }
  return (
    <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-black grid place-items-center">
      <div className="w-[70%] bg-[#b2b2b2] h-[80%] rounded-2xl flex flex-col p-[20px] absolute overflow-y-scroll">
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-center text-black text-2xl mb-2">New Project</div>
          <div className="mt-2 flex flex-row items-center justify-center text-black">
            <label htmlFor="projectName">Name</label>
            <input
              className="ml-2"
              name="name"
              id="projectName"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="mt-2 flex flex-row items-center justify-center text-black">
            <label htmlFor="projectStatus">Status</label>
            <select
              className="ml-2"
              name="status"
              id="projectStatus"
              value={data.status}
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
              value={data.summary}
              onChange={handleChange}
            />
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
