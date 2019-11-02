import React from 'react'
import FileExplorer from '../../componets/FileExplorer'
import { trashbinPath } from '../../utils/oceFolderInitialization'
import { TrashbinMenu } from '../../componets/ContextMenu/menus'

const TrashbinView = () => {
  return (
    <div style={{ width: '100%' }}>
      <FileExplorer
        mode="trashbin"
        rootPath={trashbinPath}
        contextSource={TrashbinMenu}
      />
    </div>
  )
}

export default React.memo(TrashbinView)
