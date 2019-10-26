import React, { useState, useEffect, useRef } from "react"
import { Menu, Icon } from "antd"
import { Scrollbars } from "react-custom-scrollbars"
import Console from "../../componets/Console"
import ProjectPane from "../../componets/ProjectPane"
import MonacoEditor from "../../componets/MonacoEditor"
import { useStateValue } from "../../reducer"
import { readOceConfig, writeOceConfig } from "../../utils/oceConfigOperation"
import useElementResize, { Between } from "../../hooks/useElementResize"
import "./style/index.less"

const EditorView = () => {
  // 全局状态
  const [{ openedProjectPath }, dispatch] = useStateValue()
  // 项目配置信息
  const [oceConfig, setOceConfig] = useState({})
  // let filename, filetype, createAt, updateAt
  const [JSCode, setJSCode] = useState('')

  // 项目面板
  const [showProjectPane, setShowProjectPane] = useState(true)

  // 调试面板
  const debugRef = useRef()
  const debugAnchorRef = useRef() 
  const [{ width: debugWidth }, ] = useElementResize({
    key: showProjectPane,
    horizontal: 'left',
    target: debugRef, 
    anchor: debugAnchorRef, 
    onSizeChange: ({ width }) => ({ 
      width: Between(width, 200, showProjectPane ? window.innerWidth - 300 : window.innerWidth) 
    })
  })

  // 结果预览面板
  const resultRef = useRef()
  const resultAnchorRef = useRef() 
  const [{ height: resultHeight }, setResultNewSize] = useElementResize({
    vertical: 'down',
    target: resultRef, 
    anchor: resultAnchorRef, 
    onSizeChange: ({ height }) => ({ height: Between(height, 50, window.innerHeight) })
  })  
  const resultIframeRef = useRef()

  useEffect(() => {
    setOceConfig(readOceConfig(openedProjectPath))
  }, [])

  const onConsoleToggleClick = (isshow) => {
    setResultNewSize({ height: isshow ? 300 : window.innerHeight - 48 - 30 })
  }

  const onToggleProjectPane = () => {
    setShowProjectPane(!showProjectPane)
  }

  const onJSCodeChange = ({ code }) => {
    setJSCode(code)
  }

  return (
    <React.Fragment>
      <style jsx>{`
        .container {
          display: flex;
          width: 100%;
        }
      `}</style>
      <div className="container">
        <div className="container__leftside">
          <ProjectPane 
            show={showProjectPane}
            onToggle={onToggleProjectPane}
            filename={oceConfig.filename} 
          />
        </div>
        <div className="container__rightside">
          <div className="menu-container">
            <Menu mode="horizontal">
              <Menu.Item>HTML</Menu.Item>
              <Menu.Item>CSS</Menu.Item>
              <Menu.Item>JavaScript</Menu.Item>
            </Menu>
            <Menu 
              mode="horizontal" 
              selectable={false} 
              style={{ flex: 1 }}
              onClick={()=>{console.log(resultIframeRef.current.contentWindow.postMessage(JSCode, '*'))}}
            >
              <Menu.Item><Icon type="play-circle" />运行</Menu.Item>
              <Menu.Item><Icon type="save" />保存</Menu.Item>
              <Menu.Item><Icon type="setting" />设置</Menu.Item>
            </Menu>               
          </div>
          <div className="container__rightside__inner">
            <div className="monaco-container" style={{ width: `calc(100% - ${debugWidth}px)` }}>
              <MonacoEditor onChange={onJSCodeChange}/>
            </div>
            <div className="debug-container" ref={debugRef}>
              <div className="debug-container__anchor" ref={debugAnchorRef}></div>

              <div className="result-container" ref={resultRef}>
                <Scrollbars 
                  autoHide
                  style={{ height: resultHeight }}
                >
                  <div>
                    <p>{debugWidth}</p>
                    <iframe 
                      ref={resultIframeRef}
                      frameBorder="0"
                      referrerPolicy="origin-when-cross-origin"
                      sandbox="allow-modals allow-forms allow-popups allow-scripts"
                      srcDoc={`
                        <html>
                          <body>
                            <script>
                              window.addEventListener('message', event => {
                                eval(event.data)
                              })    
                            </script>
                          </body>
                        </html>
                      `}
                    >
                    </iframe>
                  </div>
                </Scrollbars>
              </div>
              <div className="console-container">
                <div className="result-container__anchor" ref={resultAnchorRef}></div>
                <Console onToggleClick={onConsoleToggleClick} />
              </div>
            </div>
          </div>
        </div>
      </div>      
    </React.Fragment>
  )
}

export default React.memo(EditorView)