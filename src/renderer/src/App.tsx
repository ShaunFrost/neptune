import { HashRouter, Routes, Route } from 'react-router-dom'
import { DraggableTopBar } from './components'
import Home from './pages/Home'
import ProjectDetails from './pages/ProjectDetails'
import { AppContextProvider } from './store/AppContext'
import { Toaster } from 'react-hot-toast'

function App(): JSX.Element {
  const arr = ['1', '2', '3', '4', '5']
  return (
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
