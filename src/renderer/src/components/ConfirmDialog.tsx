import { PropsWithChildren } from 'react'

interface ModalProps extends PropsWithChildren {
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  confirm: () => void
}

export const ConfirmDialog = ({ setShow, confirm }: ModalProps) => {
  const handleSave = () => {
    confirm()
    setShow(false)
  }
  const closeModal = () => {
    setShow(false)
  }
  return (
    <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-black grid place-items-center">
      <div className="w-[70%] bg-[#b2b2b2] h-[80%] rounded-2xl flex flex-col p-[20px] absolute overflow-y-scroll">
        <div className="flex flex-col items-center h-[100%] justify-center">
          <div className="flex justify-center text-black text-xl mb-2">{'Are you sure?'}</div>
          <div className="mt-4 flex flex-row w-[40%] justify-evenly">
            <button
              className="pl-2 pr-2 pt-1 pb-1 rounded-lg bg-red-400 hover:bg-red-500 hover:animate-buttonscaleup"
              onClick={handleSave}
            >
              Delete
            </button>
            <button
              className="pl-2 pr-2 pt-1 pb-1 rounded-lg bg-blue-300 hover:bg-blue-400"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
