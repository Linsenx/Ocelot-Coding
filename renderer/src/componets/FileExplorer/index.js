import React, { useState, useEffect } from "react"
import { Modal, Input, message } from "antd"
import Explorer from "./explorer"
import ContextMenu from "../ContextMenu"
import PathNavigation from "./navigation"
import useWindowSize from "../../hooks/useWindowSize"
import "./style/index.css"

const fs = window.require('fs')
const path = window.require('path')
import { FILE_TYPE_ORDER } from "./constant"
import createFolder from "./processor/createFolder"
import createJSProject from "./processor/createJSProject"
import renameFolder from "./processor/renameFolder"
import softRemoveFolder from "./processor/softRemoveFolder"

import { useHistory } from "react-router-dom"
import { useStateValue } from "../../reducer"
import { OPEN_PROJECT } from "../../reducer/action"

const FileExplorer = (props = {}) => {
  const history = useHistory()
  const { height: windowHeight } = useWindowSize()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // 状态管理
  const [, dispatch] = useStateValue()

  // 当前目录数据
  const [currentPath, setCurrentPath] = useState(props.rootPath)
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

  const openContextMenu = (type) => {
    setContextMenuMode(type)
    setShowContextMenu(true)
  }
  const closeContextMenu = () => {
    setShowContextMenu(false)
  }
  const changeSelectedRow = (index) => {
    setSelectRowIndex(index)
    setSelectedFile(currentFiles[index])
  }
  const getRowClass = (index) => {
    return index === selectRowIndex ? 'active' : ' ';
  }
  const getCurrentFilePath = () => {
    return path.resolve(currentPath, selectedFile.filepath)
  }  

  const onRowClick = ({ index }) => {
    if (showContextMenu) { closeContextMenu(); return }
    changeSelectedRow(index)
  }
  const onRowDoubleClick = (option) => {
    handleOpenEvent(option)
  }
  const onRowContextMenu = ({ index, event }) => {
    event.stopPropagation()
    changeSelectedRow(index)
    openContextMenu('edit')
    setMousePosition({ top: event.clientY, left: event.clientX + 5 })
  }
  const onPlaceHolderClick = () => {
    if (showContextMenu) { closeContextMenu(); return }
  }
  const onPlaceHolderContextMenu = (event) => {
    event.stopPropagation()
    openContextMenu('create')
    setMousePosition({ top: event.clientY, left: event.clientX + 5 })
  }
  const onMenuClick = (options) => {
    handleMenuEvent(options)
    closeContextMenu()
  }
  const onChangePath = (path) => {
    const { rootPath } = props
    setCurrentPath(`${rootPath}/${path}`)
  }

  // 获得排序后文件数组
  // 排序规则：先根据类型，再根据修改日期
  const getSortedFiles = () => {
    const files = currentFiles
    files.sort((a, b) => {
      return (
        (FILE_TYPE_ORDER[a.filetype] - FILE_TYPE_ORDER[b.filetype]) ||
        (a.updateAt - b.updateAt) 
      ) 
    })
    return files
  }  
  // 获得当前目录下的文件
  const updateCurrentFiles = () => {
    const files = fs.readdirSync(currentPath)
    const fileDescripitons = files.map(filename => {
      const oceConfigPath = `${currentPath}/${filename}/oce_package.json`
      if (fs.existsSync(oceConfigPath)) {
        const oceConfig = JSON.parse(fs.readFileSync(oceConfigPath).toString())
        pathToNameMap[filename] = oceConfig.filename
        setPathToNameMap(pathToNameMap)
        return {
          filepath: filename,
          filename: oceConfig.filename,
          filetype: oceConfig.filetype,
          createAt: oceConfig.createAt,
          updateAt: oceConfig.updateAt,
        }
      }
    }).filter(d => d !== undefined)

    // 如果不在根目录，添加返回上级选项
    if (path.relative(currentPath, props.rootPath) !== '') {
      fileDescripitons.unshift({
        filename: '..',
        filepath: '..',
        filetype: 'folder',
        createAt: 0,
        updateAt: 0,      
      })      
    }
    setCurrentFiles(fileDescripitons)
  }
  // 处理右键菜单操作
  const handleMenuEvent = (option) => {
    switch (option.key) {
      case 0: // 打开
        handleOpenEvent({ file: selectedFile })
        break

      case 2: // 删除
        softRemoveFolder(getCurrentFilePath()) && message.success('文件已删除')
        updateCurrentFiles()
        break        

      case 4: // 重命名
        setShowRenameModal(true)
        break

      case 31: // 新建文件夹
        createFolder(currentPath)
        updateCurrentFiles()
        break

      case 32: // 新建JS项目
        createJSProject(currentPath)
        updateCurrentFiles()
        break
    }
  }
  // 处理打开操作
  const handleOpenEvent = ({ file }) => {
    switch(file.filetype) {
      case 'folder':
        setCurrentPath(path.resolve(currentPath, file.filepath))
        break
      case 'jsproject':
        history.push('/editor')
        dispatch({ type: OPEN_PROJECT, path: path.resolve(currentPath, file.filepath) })
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
    status && message.success('文件名已修改')
    updateCurrentFiles()
  }

  return (
    <div className="oce-file-explorer">
      <PathNavigation 
        path={currentPath} 
        pathToNameMap={pathToNameMap}
        onChangePath={(p)=>onChangePath(p)} 
      />
      { 
        showContextMenu && 
          <ContextMenu 
          mode={contextMenuMode} 
          filetype={selectedFile.filetype} 
          position={mousePosition} 
          onClick={onMenuClick} 
        />
      }

      <Modal
        key={selectedFile.filename}
        title="重命名"
        okText="确认"
        cancelText="取消"
        maskClosable={false}
        visible={showRenameModal}
        onOk={() => {handleRenameEvent()}}
        onCancel={() => setShowRenameModal(false)}
      >
        <Input 
          defaultValue={selectedFile.filename} 
          onChange={(e) => setRename(e.target.value)} 
          onPressEnter={() => {handleRenameEvent()}}
        />
      </Modal>

      <Explorer
        root={props.rootPath}
        scroll={{ height: windowHeight - 100 }}
        getRowClass={getRowClass}
        currentFiles={getSortedFiles()}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        onRowContextMenu={onRowContextMenu}
        onPlaceHolderClick={onPlaceHolderClick}
        onPlaceHolderContextMenu={onPlaceHolderContextMenu}
      />
    </div>
  )
}

export default React.memo(FileExplorer)