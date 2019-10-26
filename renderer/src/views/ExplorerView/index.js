const { app } = window.require('electron').remote
const fs = window.require('fs')
import React, { useEffect, useState } from "react"
import FileExplorer from "../../componets/FileExplorer"

// 项目路径
const projectPath = app.getPath('userData') + '/project'
// 垃圾箱路径
const trashbinPath = app.getPath('userData') + '/trashbin'

// 初始化项目文件夹
const projectDirectoryInitialize = (setInitialized) => {
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath)
  }
  if (!fs.existsSync(trashbinPath)) {
    fs.mkdirSync(trashbinPath)
  }
  setInitialized(true)
}

const ExplorerView = () => {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    projectDirectoryInitialize(setInitialized);
  }, [])

  return (
    <div style={{ width: '100%' }}>
      { initialized && <FileExplorer rootPath={projectPath} /> }
    </div>
  )
}

export default React.memo(ExplorerView)