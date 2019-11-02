import React, { useState, useEffect } from 'react'
import { Modal, Input, message } from 'antd'
import Explorer from './explorer'
import ContextMenu from '../ContextMenu'
import PathNavigation from './navigation'
import useWindowSize from '../../hooks/useWindowSize'
import './style/index.css'

const fs = window.require('fs')
const path = window.require('path')
import { FILE_TYPE_ORDER } from './constant'
import moveFile from './processor/moveFile'
import unremoveFile from './processor/unremoveFile'
import createFolder from './processor/createFolder'
import renameFolder from './processor/renameFolder'
import createJSProject from './processor/createJSProject'
import removeFolder from './processor/removeFolder'
import softRemoveFolder from './processor/softRemoveFolder'

import { useHistory } from 'react-router-dom'
import { useStateValue } from '../../reducer'
import { OPEN_PROJECT } from '../../reducer/action'

const FileExplorer = props => {
  const { rootPath, mode, contextSource } = props

  const history = useHistory()
  const { height: windowHeight } = useWindowSize()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // 状态管理
  const [, dispatch] = useStateValue()

  // 当前目录数据
  const [currentPath, setCurrentPath] = useState(rootPath)
  const [currentFiles, setCurrentFiles] = useState([])

  // 真实目录和虚拟目录名映射表
  const [pathToNameMap, setPathToNameMap] = useState(new WeakMap())

  // 被选中文件索引
  const [selectRowIndex, setSelectRowIndex] = useState(-1)
  const [selectedFile, setSelectedFile] = useState({})

  // 右键菜单状态
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuMode, setContextMenuMode] = useState('create')

  // 重命名弹框状态
  const [rename, setRename] = useState('')
  const [showRenameModal, setShowRenameModal] = useState(false)

  useEffect(() => {
    updateCurrentFiles()
  }, [currentPath])

  const openContextMenu = type => {
    setContextMenuMode(type)
    setShowContextMenu(true)
  }
  const closeContextMenu = () => {
    setShowContextMenu(false)
  }
  const changeSelectedRow = index => {
    setSelectRowIndex(index)
    setSelectedFile(currentFiles[index])
  }
  const getRowClass = index => {
    return index === selectRowIndex ? 'active' : ''
  }
  const getCurrentFilePath = () => {
    return path.resolve(currentPath, selectedFile.filepath)
  }
  const getNavigationProps = () => {
    return {
      rootIcon: mode === 'explorer' ? 'home' : 'snippets',
      rootText: mode === 'explorer' ? '工程目录' : '垃圾箱'
    }
  }

  const onRowClick = ({ index }) => {
    if (showContextMenu) {
      closeContextMenu()
      return
    }
    changeSelectedRow(index)
  }
  const onRowDoubleClick = option => {
    handleOpenEvent(option)
  }
  const onRowContextMenu = ({ index, event }) => {
    event.stopPropagation()
    changeSelectedRow(index)
    openContextMenu('edit')
    setMousePosition({ top: event.clientY, left: event.clientX + 5 })
  }
  const onPlaceHolderClick = () => {
    if (showContextMenu) {
      closeContextMenu()
      return
    }
  }
  const onPlaceHolderContextMenu = event => {
    event.stopPropagation()
    openContextMenu('create')
    setMousePosition({ top: event.clientY, left: event.clientX + 5 })
  }
  const onMenuClick = options => {
    handleMenuEvent(options)
    closeContextMenu()
  }
  const onChangePath = path => {
    setCurrentPath(`${rootPath}/${path}`)
  }
  const onMoveFile = (file, target) => {
    const fullMovedPath = path.resolve(currentPath, file)
    const fullTargetPath = path.resolve(currentPath, target)
    const status = moveFile(fullMovedPath, fullTargetPath)
    if (status) {
      message.success('文件已移动')
    }
    updateCurrentFiles()
  }

  // 获得排序后文件数组
  // 排序规则：先根据类型，再根据修改日期
  const getSortedFiles = () => {
    const files = currentFiles
    files.sort((a, b) => {
      return (
        FILE_TYPE_ORDER[a.filetype] - FILE_TYPE_ORDER[b.filetype] ||
        a.updateAt - b.updateAt
      )
    })
    return files
  }
  // 获得当前目录下的文件
  const updateCurrentFiles = () => {
    const files = fs.readdirSync(currentPath)
    const fileDescripitons = files
      .map(filename => {
        const oceConfigPath = `${currentPath}/${filename}/oce_package.json`
        if (fs.existsSync(oceConfigPath)) {
          const oceConfig = JSON.parse(
            fs.readFileSync(oceConfigPath).toString()
          )
          pathToNameMap[filename] = oceConfig.filename
          setPathToNameMap(pathToNameMap)
          return {
            filepath: filename,
            filename: oceConfig.filename,
            filetype: oceConfig.filetype,
            createAt: oceConfig.createAt,
            updateAt: oceConfig.updateAt
          }
        }
      })
      .filter(d => d !== undefined)

    // 如果不在根目录，添加返回上级选项
    if (path.relative(currentPath, rootPath) !== '') {
      fileDescripitons.unshift({
        filename: '..',
        filepath: '..',
        filetype: 'folder',
        createAt: 0,
        updateAt: 0
      })
    }
    setCurrentFiles(fileDescripitons)
  }
  // 处理右键菜单操作
  const handleMenuEvent = option => {
    switch (option.key) {
      case 'open': // 打开
        handleOpenEvent({ file: selectedFile })
        break

      case 'remove-soft': // 软删除
        handleSoftRemove()
        break

      case 'remove-hard': // 硬删除
        handleHardRemove()
        break

      case 'unremove': // 恢复文件
        handleUnremove()
        break

      case 'rename': // 重命名
        if (selectedFile.filepath === '..') {
          return message.error('该文件无法重命名')
        }
        setShowRenameModal(true)
        break

      case 'new-folder': // 新建文件夹
        createFolder(currentPath)
        updateCurrentFiles()
        break

      case 'new-jsproject': // 新建JS项目
        createJSProject(currentPath)
        updateCurrentFiles()
        break
    }
  }

  // 处理打开操作
  const handleOpenEvent = ({ file }) => {
    switch (file.filetype) {
      case 'folder':
        setCurrentPath(path.resolve(currentPath, file.filepath))
        break
      case 'jsproject':
        history.push('/editor')
        dispatch({
          type: OPEN_PROJECT,
          path: path.resolve(currentPath, file.filepath)
        })
        break
    }
  }
  // 处理重命名操作
  const handleRenameEvent = () => {
    setShowRenameModal(false)
    // 如果文件名没有变化，直接退出操作
    if (rename === '' || selectedFile.filename === rename) return
    const path = getCurrentFilePath()
    const status = renameFolder(path, rename)
    if (status) {
      message.success('文件名已修改')
      updateCurrentFiles()
    } else {
      message.error('文件名修改失败')
    }
  }
  // 处理软删除操作（移到垃圾箱）
  const handleSoftRemove = () => {
    Modal.confirm({
      title: '移动到垃圾箱',
      content: '确认要将该文件移动到垃圾箱吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (softRemoveFolder(getCurrentFilePath())) {
          message.success('文件已移入垃圾箱')
        } else {
          message.error('文件移入垃圾箱失败')
        }
        updateCurrentFiles()
      }
    })
  }
  // 处理彻底删除操作
  const handleHardRemove = () => {
    Modal.confirm({
      title: '删除文件',
      content: '确认要彻底删除该文件吗？（无法恢复）',
      okType: 'danger',
      okText: '删除',
      cancelText: '取消',
      onOk() {
        if (removeFolder(getCurrentFilePath())) {
          message.success('文件已删除')
        } else {
          message.error('文件删除失败')
        }
        updateCurrentFiles()
      }
    })
  }
  // 处理恢复文件操作
  const handleUnremove = () => {
    if (unremoveFile(getCurrentFilePath())) {
      message.success("文件已恢复到工程目录")
    } else {
      message.error("文件恢复失败")
    }
    updateCurrentFiles()
  }

  return (
    <div className="oce-file-explorer">
      <PathNavigation
        {...getNavigationProps()}
        path={currentPath}
        rootPath={rootPath}
        pathToNameMap={pathToNameMap}
        onChangePath={p => onChangePath(p)}
      />
      {showContextMenu && (
        <ContextMenu
          mode={contextMenuMode}
          contextSource={contextSource}
          filetype={selectedFile.filetype}
          position={mousePosition}
          onClick={onMenuClick}
        />
      )}

      <Modal
        key={selectedFile.filename}
        title="重命名"
        okText="确认"
        cancelText="取消"
        maskClosable={false}
        visible={showRenameModal}
        onOk={() => {
          handleRenameEvent()
        }}
        onCancel={() => setShowRenameModal(false)}
      >
        <Input
          defaultValue={selectedFile.filename}
          onChange={e => setRename(e.target.value)}
          onPressEnter={() => {
            handleRenameEvent()
          }}
        />
      </Modal>

      <Explorer
        root={rootPath}
        scroll={{ height: windowHeight - 100 }}
        getRowClass={getRowClass}
        currentFiles={getSortedFiles()}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        onRowContextMenu={onRowContextMenu}
        onPlaceHolderClick={onPlaceHolderClick}
        onPlaceHolderContextMenu={onPlaceHolderContextMenu}
        onMoveFile={onMoveFile}
      />
    </div>
  )
}
FileExplorer.defaultProps = {
  mode: 'explorer',
  rootPath: '',
  contextSource: []
}

export default React.memo(FileExplorer)
