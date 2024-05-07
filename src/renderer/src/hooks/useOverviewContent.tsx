import { useAppContext } from '@renderer/store/AppContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const useOverviewContent = () => {
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const {
    selectedProject,
    editSummary,
    setEditSummary,
    editProjectStatus,
    setEditProjectStatus,
    updateProject
  } = useAppContext()

  const resetSummary = () => {
    setEditSummary(selectedProject!.summary)
  }

  const saveSummary = () => {
    if (!selectedProject) return

    if (!editSummary) {
      toast.error('Summary is empty!', {
        position: 'bottom-center',
        duration: 1500
      })
      return
    }

    const updatedProject = {
      ...selectedProject,
      summary: editSummary
    }

    updateProject(updatedProject)
  }

  const [showEditStatusDialog, setShowEditStatusDialog] = useState(false)

  const resetStatus = () => {
    setEditProjectStatus(selectedProject!.status)
  }
  const saveStatus = () => {
    if (!selectedProject) return

    const updatedProject = {
      ...selectedProject,
      status: editProjectStatus
    }

    updateProject(updatedProject)
  }

  return {
    selectedProject,
    showSaveDialog,
    setShowSaveDialog,
    showEditStatusDialog,
    setShowEditStatusDialog,
    resetSummary,
    saveSummary,
    resetStatus,
    saveStatus
  }
}
