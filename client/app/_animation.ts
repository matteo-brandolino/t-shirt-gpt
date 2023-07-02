export const transition = { type: "spring", duration: 0.8 };
export const exitTransition = {
  opacity: 0, 
  translateX: 0, 
  translateY: 0,
  transition: { ...transition, delay: 0, },
};

export type Pos = 'left' | 'top' | 'right' | 'bottom'
export const animationSlide = (pos: Pos) => {
  const translateX = pos === 'left' ? -100 : pos === 'right' ? 100 : 0
  const translateY = pos === 'top' ? -100 : pos === 'bottom' ? 100 : 0
  return {
    initial: { opacity: 0, translateX, translateY, transition: { ...transition, delay: 0.5, }, },
    animate: {
      opacity: 1, scale: 1, translateX: 0, translateY: 0,
      transition: { ...transition, delay: 0, },
    },
    exit: {...exitTransition, translateX, translateY},
  }
}

export const animationBound = (pos:Pos) => {
  const translateX = pos === 'left' ? -100 : pos === 'right' ? 100 : 0
  const translateY = pos === 'top' ? -100 : pos === 'bottom' ? 100 : 0
  return {
    initial: { opacity: 0, translateX,translateY, transition: { ...transition, delay: 0.5, }, },
    animate: { opacity: 1, scale: 1, translateX: 0,translateY: 0, transition: { ...transition, type: "spring", stiffness: 100, } },
    exit: {...exitTransition,translateX,translateY, },
  }
}
