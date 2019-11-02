import React from 'react'
import FileExplorer from '../../componets/FileExplorer'
import { projectPath } from '../../utils/oceFolderInitialization'
import { ExplorerMenu } from '../../componets/ContextMenu/menus'

const ExplorerView = () => {

  return (
    <div style={{ width: '100%' }}>
      <FileExplorer
        mode="explorer"
        rootPath={projectPath}
        contextSource={ExplorerMenu}
      />
    </div>
  )
}

export default React.memo(ExplorerView)
