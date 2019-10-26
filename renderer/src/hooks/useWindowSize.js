import { useState, useEffect } from "react"

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize)

  function getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  function handleResize() {
    setWindowSize(getSize())
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) 

  return windowSize
}