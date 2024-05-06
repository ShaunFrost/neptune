import {
  ProjectsView,
  SearchBar,
  ProjectsGrid,
  ProjectCard,
  AddProjectModalBody,
  ProjectNotFound
} from '../components'
import { Link } from 'react-router-dom'
import { useAppContext } from '@renderer/store/AppContext'
import { useMemo, useState } from 'react'
import { ProjectType } from '@shared/types'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { Modal } from '@renderer/components/Dialog'
import { INITIAL_ADD_PROJECT_DATA } from '@shared/constants'

const Home = () => {
  const { projects, addProjectData, updateProject, setAddProjectData } = useAppContext()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredProjects = useMemo(() => {
    if (searchQuery === '') return projects
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, projects])

  return (
    <ProjectsView className="relative">
      <SearchBar
        setShowAddDialog={setShowAddDialog}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {filteredProjects.length > 0 ? (
        <ProjectsGrid>
          {filteredProjects.map((project) => {
            return (
              <div key={project.id}>
                <Link to={`/projects/${project.id}`}>
                  <ProjectCard project={project} className="bg-[#1a1a1a] shadow-md shadow-black" />
                </Link>
              </div>
            )
          })}
        </ProjectsGrid>
      ) : (
        <ProjectNotFound />
      )}

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
