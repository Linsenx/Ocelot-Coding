import React, { useState, useEffect, useRef, useReducer } from 'react'
import { Resizable } from 're-resizable'
import { Scrollbars } from 'react-custom-scrollbars'
import Console from '../../componets/Console'
import ProjectPane from '../../componets/ProjectPane'
import MonacoEditor from '../../componets/MonacoEditor'
import EditorMenu from '../../componets/EditorMenu'
import IframeJSSandbox from '../../componets/IframeSandbox'
import { useStateValue } from '../../reducer'
import { readOceConfig, writeOceConfig } from '../../utils/oceConfigOperation'
import useElementResize, { Between } from '../../hooks/useElementResize'
import './style/index.less'

const EditorView = () => {
  // 全局状态
  const [{ openedProjectPath }, dispatch] = useStateValue()

  // 项目配置信息
  const [oceConfig, setOceConfig] = useState({})

  // 当前编辑器
  const [currentEditor, setCurrentEditor] = useState('html')
  const [JSCode, setJSCode] = useState('')
  const [CSSCode, setCSSCode] = useState('')
  const [HTMLCode, setHTMLCode] = useState('')
  const JSEditor = useRef()
  const CSSEditor = useRef()
  const HTMLEditor = useRef()

  // 项目面板
  const [showProjectPane, setShowProjectPane] = useState(true)

  // 调试面板
  const [debugWidth, setDebugWidth] = useState(300)
  // const debugRef = useRef()
  // const debugAnchorRef = useRef()
  // const {
  //   newSize: { width: debugWidth },
  //   status: debugResizeStatus
  // } = useElementResize({
  //   key: showProjectPane,
  //   horizontal: 'left',
  //   target: debugRef,
  //   anchor: debugAnchorRef,
  //   onSizeChange: ({ width }) => ({
  //     width: Between(
  //       width,
  //       200,
  //       showProjectPane ? window.innerWidth - 300 : window.innerWidth
  //     )
  //   })
  // })

  // 结果预览面板
  // const resultRef = useRef()
  // const resultAnchorRef = useRef()
  // const {
  //   newSize: { height: resultHeight },
  //   setNewSize: setResultNewSize,
  //   status: resultResizeStatus
  // } = useElementResize({
  //   vertical: 'down',
  //   target: resultRef,
  //   anchor: resultAnchorRef,
  //   onSizeChange: ({ height }) => ({
  //     height: Between(height, 50, window.innerHeight)
  //   })
  // })

  // 结果显示面板
  const resultSandboxRef = useRef()

  // 调试输出面板
  const [consoleData, consoleDispatch] = useReducer(
    function(state, action) {
      switch (action.type) {
        case 'add':
          return { content: [...state.content, action.item] }
        case 'clear':
          return { content: [] }
      }
    },
    { content: [] }
  )

  useEffect(() => {
    setOceConfig(readOceConfig(openedProjectPath))
  }, [])
  useEffect(() => {
    onLayoutEditors()
  }, [showProjectPane, debugWidth])

  const getIframeStyle = () => {
    // return resultResizeStatus === 'resizing' || debugResizeStatus === 'resizing'
    //   ? { pointerEvents: 'none' }
    //   : { pointerEvents: 'auto' }
  }

  const onConsoleToggleClick = isshow => {
    // setResultNewSize({ height: isshow ? 300 : window.innerHeight - 48 - 30 })
  }
  const onConsoleLog = args => {
    consoleDispatch({ type: 'add', item: args })
  }

  const onToggleProjectPane = () => {
    setShowProjectPane(!showProjectPane)
  }

  const onLayoutEditors = () => {
    JSEditor.current.layout()
    CSSEditor.current.layout()
    HTMLEditor.current.layout()
  }

  const onJSCodeChange = ({ code }) => setJSCode(code)
  const onCSSCodeChange = ({ code }) => setCSSCode(code)
  const onHTMLCodeChange = ({ code }) => setHTMLCode(code)

  const onRunCode = () => {
    consoleDispatch({ type: 'clear' })
    resultSandboxRef.current.runCode({
      JS: JSCode,
      CSS: CSSCode,
      HTML: HTMLCode
    })
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
          <EditorMenu
            onRun={onRunCode}
            onSave={() => {}}
            onSetting={() => {}}
            currentEditor={currentEditor}
            onSwitchEditor={editor => setCurrentEditor(editor)}
          />
          <div className="container__rightside__inner">
            <div
              className="monaco-container"
              // style={{ width: `calc(100% - ${debugWidth}px)`, height: 'calc(100vh - 48px)' }}
            >
              <div
                style={
                  currentEditor !== 'html'
                    ? { opacity: '0', pointerEvents: 'none' }
                    : {}
                }
              >
                <MonacoEditor
                  ref={HTMLEditor}
                  language="html"
                  onChange={onHTMLCodeChange}
                />
              </div>
              <div
                style={
                  currentEditor !== 'css'
                    ? { opacity: '0', pointerEvents: 'none' }
                    : {}
                }
              >
                <MonacoEditor
                  ref={CSSEditor}
                  language="css"
                  onChange={onCSSCodeChange}
                />
              </div>
              <div
                style={
                  currentEditor !== 'javascript'
                    ? { opacity: '0', pointerEvents: 'none' }
                    : {}
                }
              >
                <MonacoEditor
                  ref={JSEditor}
                  language="javascript"
                  onChange={onJSCodeChange}
                />
              </div>
            </div>
            <div
              className="debug-container"
              // ref={debugRef}
            >
              <Resizable
                enable={{ left: true }}
                size={{ width: debugWidth }}
                onResizeStop={(e, dir, ref, d) => {
                  setDebugWidth(prev => prev + d.width)
                }}
                // onResizeStop={onLayoutEditors}
              >
                <div
                  className="debug-container__anchor"
                  // ref={debugAnchorRef}
                ></div>
                <div
                  className="result-container"
                  // ref={resultRef}
                  style={getIframeStyle()}
                >
                  <Resizable
                    defaultSize={{ height: 300 }}
                    maxHeight={window.innerHeight - 300}
                    enable={{ bottom: true }}
                  >
                    <IframeJSSandbox
                      ref={resultSandboxRef}
                      onConsoleLog={onConsoleLog}
                    />
                  </Resizable>
                </div>
                <div className="console-container">
                  {/* <div
                  className="result-container__anchor"
                  ref={resultAnchorRef}
                ></div> */}
                  <Console onToggleClick={onConsoleToggleClick}>
                    {/* <Scrollbars style={{ height: `calc(100vh - 30px - ${resultHeight}px)` }}> */}
                    {consoleData.content.map((item, index) => {
                      return <div key={index}> > {item.join(',')}</div>
                    })}
                    {/* </Scrollbars> */}
                  </Console>
                </div>
              </Resizable>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default React.memo(EditorView)
