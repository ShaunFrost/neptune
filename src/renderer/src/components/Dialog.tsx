import { PropsWithChildren } from 'react'
import TransitionComponent from './TransitionComponent'
import { ANIMATIONS } from '@shared/types'

interface ModalProps extends PropsWithChildren {
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  heading: string
  save: () => void
  reset: () => void
}

export const Modal = ({ setShow, children, heading, save, reset }: ModalProps) => {
  const handleSave = () => {
    save()
    setShow(false)
  }
  const closeModal = () => {
    reset()
    setShow(false)
  }
  return (
    <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-black grid place-items-center">
      <div className="w-[70%] bg-[#b2b2b2] h-[80%] rounded-2xl flex flex-col p-[20px] absolute overflow-y-scroll">
        <div className="flex flex-col items-center h-[100%] justify-center">
          <TransitionComponent type={ANIMATIONS.SCALE_FROM_MIDDLE}>
            <div className="flex justify-center text-black text-2xl mb-2">{heading}</div>
            {children}
            <div className="mt-4 flex flex-row w-[100%] justify-evenly">
              <button
                className="pl-2 pr-2 pt-1 pb-1 rounded-lg bg-blue-300 hover:bg-blue-400 hover:animate-buttonscaleup"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="pl-2 pr-2 pt-1 pb-1 rounded-lg bg-blue-300 hover:bg-blue-400 hover:animate-buttonscaleup"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </TransitionComponent>
        </div>
      </div>
    </div>
  )
}
