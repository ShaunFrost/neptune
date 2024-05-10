import { useOverviewContent } from '@renderer/hooks/useOverviewContent'
import { ComponentProps } from 'react'
import { LiaEdit } from 'react-icons/lia'
import { twMerge } from 'tailwind-merge'
import { Modal } from '../Dialog'
import { EditProjectStatusModalBody, EditSummaryModalBody } from '../DialogBody'
import TransitionComponent from '../TransitionComponent'

type OverviewProps = ComponentProps<'div'>

export const Overview = ({ className, ...props }: OverviewProps) => {
  const {
    selectedProject,
    showSaveDialog,
    setShowSaveDialog,
    showEditStatusDialog,
    setShowEditStatusDialog,
    resetSummary,
    saveSummary,
    resetStatus,
    saveStatus
  } = useOverviewContent()

  return (
    <TransitionComponent>
      <div className={twMerge('p-4', className)} {...props}>
        <div className="font-anton text-4xl">
          {selectedProject!.name ? selectedProject!.name.toUpperCase() : ''}
        </div>
        <div className="font-anton mt-4 p-4 h-[300px] overflow-y-scroll rounded-md bg-black flex flex-col">
          <div className="flex flex-row justify-between">
            <span className="text-3xl">Summary</span>
            <div className="text-2xl hover:cursor-pointer" onClick={() => setShowSaveDialog(true)}>
              <LiaEdit />
            </div>
          </div>
          <div className="mt-4 text-xl">{selectedProject!.summary}</div>
        </div>
        <div className="font-anton mt-4 p-4 h-[150px] overflow-y-scroll rounded-md bg-black flex flex-col">
          <div className="flex flex-row justify-between">
            <span className="text-3xl">Status</span>
            <div
              className="text-2xl hover:cursor-pointer"
              onClick={() => setShowEditStatusDialog(true)}
            >
              <LiaEdit />
            </div>
          </div>
          <div className="mt-4 text-xl">{selectedProject!.status}</div>
        </div>
        {showSaveDialog ? (
          <Modal
            setShow={setShowSaveDialog}
            heading="Edit Summary"
            save={saveSummary}
            reset={resetSummary}
          >
            <EditSummaryModalBody />
          </Modal>
        ) : (
          <></>
        )}
        {showEditStatusDialog ? (
          <Modal
            setShow={setShowEditStatusDialog}
            heading="Edit Status"
            save={saveStatus}
            reset={resetStatus}
          >
            <EditProjectStatusModalBody />
          </Modal>
        ) : (
          <></>
        )}
      </div>
    </TransitionComponent>
  )
}
