import * as React from 'react'

interface ICarousel {
  currentIndex: number
  gap?: number;
  changeCurrentIndex: (index: number) => void
}

const carouselStyles = {
  display: 'grid',
  gridAutoFlow: 'column',
  justifyContent: 'center',
  cursor: 'pointer',
}

export const Carousel: React.FC<ICarousel> = ({ 
  changeCurrentIndex,
  currentIndex,
  children,
  gap = 0
}) => {
  const [width, setWidth] = React.useState(0)
  const refs = React.useRef<number[]>([])
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const wasClicked = React.useRef<boolean>(false)
  const isInitialRender = React.useRef<boolean>(true)
  const pointerPosition = React.useRef({
    start: 0,
    end: 0
  })
  const carouselContainerRef = React.useRef<HTMLDivElement>(null)
  const transitions = React.useRef<(number | null)[]>([])

  React.useEffect(() => {
    if (refs.current) {
      setWidth(refs.current.reduce((prev, curr) => {
        return prev + curr
      }, 0))
    }
  }, [])

  React.useEffect(() => {
    if (!isInitialRender.current) {
      startTransitionAnimation()
    } 
    const x = transitions.current[currentIndex]
    if (x) {
      changeCarouselPosition(x)
    }
    isInitialRender.current = false
  }, [currentIndex])

  React.useEffect(() => {
    const center = (carouselContainerRef.current?.clientWidth ?? 0) / 2
    const startingPosition = center - ((refs.current[0]) / 2)
    changeCarouselPosition(startingPosition)

    const arr = refs.current.reduce<number[]>((prev, curr, index) => {
      if (index === 0) {
        return [startingPosition]
      } else {
        const [lastValue] = prev.reverse()
        const previousIndex = refs.current[index - 1]

        const nextSlide = (lastValue - (center - previousIndex / 2) - previousIndex + (center - (curr / 2)))
        return [...prev, nextSlide]
      }
    }, [])
    transitions.current = arr.sort((a, b) => b-a);
  }, [])

  const handleTouchMoveCapture = (e: React.TouchEvent<HTMLDivElement>) => {
    capturePointerMovement(e.touches[0].clientX)
  }

  const capturePointerMovement = (x: number) => {
    const carousel = carouselRef.current
    const currentTransition = transitions.current[currentIndex]
    if (carousel && currentTransition !== undefined && currentTransition !== null) {
      pointerPosition.current.end = x
      carousel.style.transform = `translateX(${Math.round((x - pointerPosition.current.start + currentTransition)).toString()}px)`
    }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    stopTransitionAnimation()
    pointerPosition.current.start = e.touches[0].clientX
  }

  const changeCarouselPosition = (position: number) => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${position}px)`
    }
  }

  const startTransitionAnimation = () => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.style.transitionDuration = '500ms'
    }
  }

  const stopTransitionAnimation = () => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.style.transitionDuration = '0ms'
    }
  }
    
  const handleTouchEnd = () => {
    startTransitionAnimation()
    manageSwipe()
    pointerPosition.current.end = 0
    pointerPosition.current.start = 0
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    wasClicked.current = true
    stopTransitionAnimation()
    pointerPosition.current.start = e.clientX
  }

  const onMouseUp = () => {
    if (wasClicked.current) {
      startTransitionAnimation()
      manageSwipe()
  
      pointerPosition.current.end = 0
      pointerPosition.current.start = 0
      wasClicked.current = false
    }
  }

  const onMouseCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wasClicked.current) {
      capturePointerMovement(e.clientX)
    }
  }

  const manageSwipe = () => {
    if (pointerPosition.current.start < pointerPosition.current.end) {
      swipeLeft()
    } else {
      swipeRight()
    }
  }

  const swipeLeft = () => {
    const index = currentIndex - 1
    if (index < 0 || (Math.abs(pointerPosition.current.start - pointerPosition.current.end) < 15) || pointerPosition.current.end === 0) {
      changeCarouselPosition(transitions.current[currentIndex] ?? 0)
    } else {
      changeCurrentIndex(index)
    }
  }

  const swipeRight = () => {
    const index = currentIndex + 1
    if (index >= React.Children.count(children) || (Math.abs(pointerPosition.current.end - pointerPosition.current.start) < 15) || pointerPosition.current.end === 0) {
      changeCarouselPosition(transitions.current[currentIndex] ?? 0)
    } else {
      changeCurrentIndex(index)
    }
  }

  const onMouseOut = () => {
    if (wasClicked.current) {
      startTransitionAnimation()
      manageSwipe()
      wasClicked.current = false
    }
  }

  const spaceBetween = `${gap > 0 ? (gap / 2) : 0 }px`

  return (
    <div
      style={{width: "100%", overflow: 'hidden'}}
      onTouchMoveCapture={handleTouchMoveCapture}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleClick}
      ref={carouselContainerRef}
      onMouseMove={onMouseCapture}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
    >
      <div
        style={{
          ...carouselStyles,
          userSelect: 'none',
          width: width,
        }}
        ref={carouselRef}
      >
        {React.Children.map(children, (child) => {
          const item = child as React.ReactElement
          console.log(item.props.style)
          return React.cloneElement(item, {
            style: {
              ...item.props.style,
              marginRight: spaceBetween,
              marginLeft: spaceBetween
            },
            ref: (node: HTMLDivElement) => {
              if (node?.offsetWidth) {
                refs.current.push(node.offsetWidth + (gap ?? 0))
              }
            }
          })
        })}
      </div>
    </div>
  )
} 