import { Link, useParams, redirect } from 'react-router-dom'
import {
  ProjectLayout,
  Sidebar,
  Content,
  SideNavBar,
  NavBarItem,
  Overview,
  Tasks,
  Drawboard,
  Notes
} from '../components'
import { useEffect, useState } from 'react'
import { LuHome, LuLightbulb, LuList, LuClipboardSignature, LuStickyNote } from 'react-icons/lu'
import { useAppContext } from '@renderer/store/AppContext'
import TransitionComponent from '@renderer/components/TransitionComponent'

const NavBarItemList = [
  {
    name: 'Overview',
    icon: <LuLightbulb />
  },
  {
    name: 'Tasks',
    icon: <LuList />
  },
  {
    name: 'Drawboard',
    icon: <LuClipboardSignature />
  },
  {
    name: 'Notes',
    icon: <LuStickyNote />
  }
]

const ProjectDetails = () => {
  const { id } = useParams()
  if (!id) {
    redirect('/')
    return <></>
  }
  const { setSelectedProjectId, selectedProject } = useAppContext()
  useEffect(() => {
    setSelectedProjectId(id)
  }, [])
  const [content, setContent] = useState<JSX.Element>()
  useEffect(() => {
    if (!content) {
      setContent(<Overview />)
    }
  }, [selectedProject])

  const [activeTab, setActiveTab] = useState('Overview')

  const getContent = (name: string): JSX.Element => {
    if (name === 'Overview') {
      return <Overview />
    }
    if (name === 'Tasks') {
      return <Tasks />
    }
    if (name === 'Drawboard') {
      return <Drawboard />
    }
    if (name === 'Notes') {
      return <Notes />
    }
    return <></>
  }

  const handleNavItemClick = (name: string) => {
    setActiveTab(name)
  }

  useEffect(() => {
    setContent(getContent(activeTab))
  }, [activeTab])

  return (
    <TransitionComponent>
      <ProjectLayout>
        <Sidebar className="bg-[#1a1a1a] rounded-lg ml-2">
          <SideNavBar>
            <Link to="/">
              <NavBarItem>
                <div>
                  <LuHome />
                </div>
                <div className="ml-2">Home </div>
              </NavBarItem>
            </Link>
            {NavBarItemList.map((navBarItem) => {
              return (
                <NavBarItem
                  key={navBarItem.name}
                  active={activeTab === navBarItem.name}
                  onClick={() => handleNavItemClick(navBarItem.name)}
                >
                  <div>{navBarItem.icon}</div>
                  <div className="ml-2">{navBarItem.name}</div>
                </NavBarItem>
              )
            })}
          </SideNavBar>
        </Sidebar>
        <Content className="bg-[#1a1a1a] rounded-lg ml-2 mr-2 relative">{content}</Content>
      </ProjectLayout>
    </TransitionComponent>
  )
}

export default ProjectDetails
