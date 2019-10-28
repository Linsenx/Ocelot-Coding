import { useState, useEffect } from "react"
import { throttle } from "lodash"

/**
 * 缩放元素大小
 */
export default function useElementResize(
  { key, target, anchor, horizontal, vertical, onSizeChange }
) {
  const [status, setStatus] = useState('normal')
  const [newSize, setNewSize] = useState({ width: 0, height: 0 })
  let currentWidth, currentHeight
  const horK = horizontal === 'right' ? 1 : horizontal === 'left' ? -1 : 0
  const vertK = vertical === 'down' ? 1 : vertical === 'up' ? -1 : 0
  if (onSizeChange === undefined) {
    onSizeChange = ({ width, height }) => ({ width, height })
  }

  // const setSize = throttle(() => {
  //   const size = onSizeChange({ width: currentWidth, height: currentHeight })
  //   currentWidth = size.width || currentWidth
  //   currentHeight = size.height || currentHeight
  //   setNewSize({ width: currentWidth, height: currentHeight })
  // }, 1000)

  const setSize = () => {
    const size = onSizeChange({ width: currentWidth, height: currentHeight })
    currentWidth = size.width || currentWidth
    currentHeight = size.height || currentHeight
    setNewSize({ width: currentWidth, height: currentHeight })
  }

  useEffect(() => {
    let originMouseX, originMouseY
    let originWidth, originHeight
    currentWidth = originWidth = target.current.clientWidth
    currentHeight = originHeight = target.current.clientHeight
    setSize()
    setStatus('normal')

    const onMouseDown = (e) => {
      const { pageX, pageY } = e
      setStatus('resizing')
      originMouseX = pageX
      originMouseY = pageY
      originWidth = target.current.clientWidth
      originHeight = target.current.clientHeight
      window.addEventListener('mouseup', onMouseUp, { once: true })
      window.addEventListener('mousemove', onMouseMove)
    }
    const onMouseUp = (e) => {
      setStatus('normal')
      window.removeEventListener('mousemove', onMouseMove)
    }
    const onMouseMove = (e) => {
      const { pageX, pageY } = e
      const widthChange = (pageX - originMouseX) * horK
      const heightChange = (pageY - originMouseY) * vertK
      if (horizontal) currentWidth = originWidth + widthChange
      if (vertical) currentHeight = originHeight + heightChange
      if (horizontal) target.current.style.width = `${currentWidth}px`        
      if (vertical) target.current.style.height = `${currentHeight}px`      
      setSize()
    }
    anchor.current.addEventListener('mousedown', onMouseDown)

    return () => {
      anchor.current.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [target, anchor, horizontal, vertical, key])

  useEffect(() => {
    if (horizontal) target.current.style.width = `${newSize.width}px`        
    if (vertical) target.current.style.height = `${newSize.height}px`
  }, [newSize])

  return {newSize, setNewSize, status}
}

export function Between(number, minimal, maximal) {
  return Math.min(maximal, Math.max(minimal, number))
}