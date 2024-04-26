import { HashRouter, Routes, Route } from 'react-router-dom'
import { DraggableTopBar } from './components'
import Home from './pages/Home'
import ProjectDetails from './pages/ProjectDetails'
import { AppContextProvider } from './store/AppContext'
import { Toaster } from 'react-hot-toast'

function App(): JSX.Element {
  const arr = ['1', '2', '3', '4', '5']
  return (
    // <div className="flex h-full items-center justify-center">
    //   {/* <span className="text-4xl text-blue-500">Neptune</span> */}
    //   <ProjectsView />
    // </div>
    // <ProjectLayout>
    //   <Sidebar className="border-4 border-red-500">Sidebar</Sidebar>
    //   <Content className="border-4 border-blue-500">Content</Content>
    // </ProjectLayout>
    <>
      <AppContextProvider>
        <DraggableTopBar />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Routes>
        </HashRouter>
      </AppContextProvider>
      <Toaster />
    </>
  )
}

export default App
