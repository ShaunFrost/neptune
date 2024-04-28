import {
  ProjectsView,
  SearchBar,
  ProjectsGrid,
  ProjectCard,
  AddProjectModalBody
} from '../components'
import { Link } from 'react-router-dom'
import { useAppContext } from '@renderer/store/AppContext'
import { useState } from 'react'
import { ProjectStatus, ProjectType } from '@shared/types'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { Modal } from '@renderer/components/Dialog'
import { INITIAL_ADD_PROJECT_DATA } from '@shared/constants'

const Home = () => {
  const { projects, addProjectData, updateProject, setAddProjectData } = useAppContext()
  const [showAddDialog, setShowAddDialog] = useState(false)

  const resetAddProjectFields = () => {
    setAddProjectData(INITIAL_ADD_PROJECT_DATA)
  }

  const handleAddNewProject = () => {
    if (!addProjectData.name || !addProjectData.summary) {
      toast.error('Name and summary required!', {
        position: 'bottom-center',
        duration: 1500
      })
      return
    }
    const newProject: ProjectType = {
      id: uuidv4(),
      ...addProjectData,
      completedTasks: 0,
      totalTasks: 0,
      tasks: []
    }
    updateProject(newProject)
    resetAddProjectFields()
  }

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
      {showAddDialog ? (
        <Modal
          setShow={setShowAddDialog}
          heading="New Project"
          save={handleAddNewProject}
          reset={resetAddProjectFields}
        >
          <AddProjectModalBody />
        </Modal>
      ) : (
        <></>
      )}
    </ProjectsView>
  )
}

export default Home
