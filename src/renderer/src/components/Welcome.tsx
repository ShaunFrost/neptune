import { useState } from 'react'
import Logo from '../assets/icon.png'
import { TypeAnimation } from 'react-type-animation'

type WelcomeProps = {
  startApp: () => void
}

const Welcome = ({ startApp }: WelcomeProps) => {
  const [showButton, setShowButton] = useState<boolean>(false)
  return (
    <div className="mt-[2%] flex flex-col w-full h-[90%] items-center justify-center">
      <div className="flex justify-center items-center h-[50%]">
        <img src={Logo} width={300} height={300} />
      </div>
      <div className="flex flex-col justify-center items-center h-[20%] w-[80%]">
        <TypeAnimation
          sequence={['Welcome to Neptune!', 1000]}
          speed={50}
          style={{ fontSize: '2rem' }}
          cursor={false}
        />
        <TypeAnimation
          sequence={[
            1200,
            `An offline application to manage your side projects!`,
            1200,
            `An offline application to stay on top of your side projects!`,
            1200,
            `An offline application to help land your dream job!`,
            () => setShowButton(true)
          ]}
          speed={40}
          style={{ fontSize: '1rem' }}
          repeat={Infinity}
          cursor={false}
        />
      </div>
      <div className="h-[20%]">
        {showButton && (
          <button
            className="p-2 rounded-md bg-[#7BC9FF] hover:bg-[#8576FF] hover:cursor-pointer"
            onClick={startApp}
          >{`Let's Start!`}</button>
        )}
      </div>
    </div>
  )
}

export default Welcome
