import { ANIMATIONS } from '@shared/types'
import { motion } from 'framer-motion'
import { PropsWithChildren } from 'react'

type TransitionComponentProps = {
  type?: ANIMATIONS
  transitionDuration?: number
  childrenDelay?: number
  classStr?: string
} & PropsWithChildren

const transitionAnimations = {
  slideFromRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  },
  scaleFromMiddle: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 }
  },
  opacityOnly: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }
}

const TransitionComponent = ({
  children,
  type = ANIMATIONS.SLIDE_FROM_RIGHT,
  transitionDuration = 0.8,
  classStr = '',
  childrenDelay = 0
}: TransitionComponentProps) => {
  return (
    <motion.div
      variants={transitionAnimations[type]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: transitionDuration, delayChildren: childrenDelay }}
      className={classStr}
    >
      {children}
    </motion.div>
  )
}

export default TransitionComponent
