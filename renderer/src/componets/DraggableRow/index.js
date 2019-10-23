import HTML5Backend from "react-dnd-html5-backend"
import { DndProvider } from "react-dnd"
import { useDrag } from "react-dnd"

function DragableItem() {
  const [{ background }, dragRef] = useDrag({
    item: { type: 'oooooo' },
    collect: monitor => ({
      background: monitor.isDragging() ? '#000' : '#fff',
    })
  })
  return (
    <div ref={dragRef} style={{ background, width: '100', height: '100', border: '1px solid red' }}>
      hello drag
    </div>
  )
}

<div style={{marginTop: 200}}>
<DndProvider backend={HTML5Backend}>
  <DragableItem/>
</DndProvider>
</div>