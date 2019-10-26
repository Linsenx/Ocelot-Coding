import React from "react"
import { Icon } from "antd"
const { ipcRenderer } = window.require('electron')

const WindowController = () => {  
  const onClose = () => {
    ipcRenderer.send('close')
  }
  const onMinimize = () => {
    ipcRenderer.send('minimize')
  }

  return (
    <div className="oce-window-controller">
      <style jsx>{`
        .oce-window-controller {
          position: absolute;
          top: 12px;
          right: 20px;
        }
        :global(.anticon-close), :global(.anticon-minus) {
          cursor: pointer;
          font-size: 13px;
          -webkit-app-region: no-drag;
        }
        :global(.anticon-close):hover, :global(.anticon-minus):hover {
          color: #2593FC;
        }        
      `}</style>
      <Icon 
        type="minus" 
        onClick={onMinimize}
      />
      <Icon 
        type="close" 
        style={{ marginLeft: 15 }} 
        onClick={onClose}
      />
    </div>
  )
}

export default React.memo(WindowController)