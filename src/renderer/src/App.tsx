import { HashRouter, Routes, Route } from 'react-router-dom'
import { DraggableTopBar } from './components'
import Home from './pages/Home'
import ProjectDetails from './pages/ProjectDetails'
import { AppContextProvider } from './store/AppContext'
import { Toaster } from 'react-hot-toast'
import Welcome from './components/Welcome'
import { useState } from 'react'

function App(): JSX.Element {
  const [showApp, setShowApp] = useState<boolean>(false)
  return (
    <>
      {!showApp ? (
        <Welcome startApp={() => setShowApp(true)} />
      ) : (
        <AppContextProvider>
          <DraggableTopBar />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
            </Routes>
          </HashRouter>
        </AppContextProvider>
      )}
      <Toaster />
    </>
  )
}

export default App
