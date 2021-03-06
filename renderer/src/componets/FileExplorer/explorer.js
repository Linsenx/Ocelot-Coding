import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars'
import { FILE_TYPE, ICONS } from './constant'
import { noop } from '../../utils/func'

const headerRender = () => (
  <div className="oce-file-explorer__table__head">
    <table style={{ width: '100%' }}>
      <colgroup>
        <col style={{ width: '50%' }} />
        <col style={{ width: '30%', minWidth: 150 }} />
        <col style={{ width: '20%', minWidth: 100 }} />
      </colgroup>
      <thead style={{ position: 'sticky', top: '0px' }}>
        <tr>
          <th>文件名</th>
          <th>修改日期</th>
          <th>文件类型</th>
        </tr>
      </thead>
    </table>
  </div>
)

const fileNameFilter = filename => {
  return filename === '..' ? '..上级目录' : filename
}
const fileTypeFilter = filetype => {
  return FILE_TYPE[filetype] ? FILE_TYPE[filetype] : '未知类型'
}
const fileUpdateAtFilter = updateAt => {
  return updateAt ? dayjs(updateAt).format('YYYY-MM-DD HH:mm:ss') : '-'
}

const rowRender = file => (
  <React.Fragment>
    <td>
      <FontAwesomeIcon
        size="6x"
        icon={ICONS[file.filetype]}
        style={{ fontSize: 28, marginRight: 10, verticalAlign: 'middle' }}
      />
      <span style={{ verticalAlign: 'middle' }}>
        {fileNameFilter(file.filename)}
      </span>
    </td>
    <td style={{ minWidth: 200 }}>{fileUpdateAtFilter(file.updateAt)}</td>
    <td style={{ minWidth: 100 }}>{fileTypeFilter(file.filetype)}</td>
  </React.Fragment>
)

const Explorer = props => {
  const {
    scroll,
    currentFiles,
    getRowClass,
    onRowClick,
    onRowDoubleClick,
    onRowContextMenu,
    onPlaceHolderClick,
    onPlaceHolderContextMenu,
    onMoveFile
  } = props
  
  const containerRef = useRef()
  const [dragger, setDragger] = useState({})
  const [draggingFile, setDraggingFile] = useState({})

  const onFileDragStart = ({ event, file }) => {
    event.currentTarget.style.opacity = .5
    setDraggingFile(file)
    setDragger(event.currentTarget)
  }
  const onFileDragEnter = e => {
    e.currentTarget.classList.add('target')
  }  
  const onFileDragLeave = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (e.clientY < rect.top || e.clientY >= rect.bottom || e.clientX < rect.left || e.clientX >= React.right) {
      e.currentTarget.classList.remove('target')
    }
  }
  const onFileDragOver = e => {
    e.preventDefault()
  }  
  const onFileDrop = ({ event, file }) => {
    event.preventDefault()
    dragger.style.opacity = ''
    event.currentTarget.classList.remove('target')
    containerRef.current.classList.remove('dragging')
    if (file.filetype === 'folder' && file.filepath !== draggingFile.filepath) {
      const movedFile = draggingFile.filepath
      const moveToPath = file.filepath
      onMoveFile(movedFile, moveToPath)
    } 
  }

  return (
    <div className="oce-file-explorer__table">
      {headerRender()}
      <Scrollbars style={{ height: scroll.height }}>
        <div ref={containerRef} className="oce-file-explorer__table__body">
          <table style={{ width: '100%' }}>
            <colgroup>
              <col style={{ width: '50%' }} />
              <col style={{ width: '30%', minWidth: 150 }} />
              <col style={{ width: '20%', minWidth: 100 }} />
            </colgroup>
            <tbody>
              {currentFiles.map((file, index) => (
                <tr
                  draggable="true"
                  key={index}
                  className={['explorer-item', getRowClass(index)].join(' ')}
                  onClick={event => onRowClick({ event, index, file })}
                  onDrop={event => onFileDrop({ event, file })}
                  onDragStart={event => onFileDragStart({ event, file })}
                  onDragEnterCapture={onFileDragEnter}
                  onDragLeave={onFileDragLeave}
                  onDragOver={onFileDragOver}
                  onDoubleClick={event =>
                    onRowDoubleClick({ event, index, file })
                  }
                  onContextMenu={event =>
                    onRowContextMenu({ event, index, file })
                  }
                >
                  {rowRender(file)}
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className="contextmenu-placeholder"
            style={{ height: '200px' }}
            onClick={event => onPlaceHolderClick(event)}
            onContextMenu={event => onPlaceHolderContextMenu(event)}
          />
        </div>
      </Scrollbars>
    </div>
  )
}

Explorer.defaultProps = {
  scroll: { width: 0, height: 0 },
  currentFiles: [],
  getRowClass: noop,
  onRowClick: noop,
  onRowDoubleClick: noop,
  onRowContextMenu: noop,
  onPlaceHolderClick: noop,
  onPlaceHolderContextMenu: noop,
  onMoveFile: noop
}

export default React.memo(Explorer)
