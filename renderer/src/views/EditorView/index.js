import { debounce } from 'lodash'
import React, { useState, useEffect, useRef, useReducer } from 'react'
import { message } from 'antd'
import { Resizable } from 're-resizable'
import { Scrollbars } from 'react-custom-scrollbars'
import Console from '../../componets/Console'
import ProjectPane from '../../componets/ProjectPane'
import MonacoEditor from '../../componets/MonacoEditor'
import EditorMenu from '../../componets/EditorMenu'
import EditorSetting from '../../componets/EditorSetting'
import IframeJSSandbox from '../../componets/IframeSandbox'
import { useStateValue } from '../../reducer'
import { readOceConfig, writeOceConfig } from '../../utils/oceConfigOperation'
import SaveJSProject from '../../componets/FileExplorer/processor/saveJSProject'
import ReadJSProject from '../../componets/FileExplorer/processor/readJSProject'

import './style/index.less'
import readJSProject from '../../componets/FileExplorer/processor/readJSProject'

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

  // 结果预览面板
  const [resultHeight, setResultHeight] = useState(300)

  // 结果显示面板
  const resultSandboxRef = useRef()

  // 设置面板
  const [showSetting, setShowSetting] = useState(false)

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
    const project = readJSProject(openedProjectPath)
    onJSCodeChange({ code: project.JS })
    onCSSCodeChange({ code: project.CSS })
    onHTMLCodeChange({ code: project.HTML })

    let onWindowResize = debounce(onLayoutEditors, 500)
    window.addEventListener('resize', onWindowResize)
    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  useEffect(() => {
    onLayoutEditors()
  }, [showProjectPane, debugWidth])

  const getEditorStyle = editor => {
    return currentEditor !== editor
      ? { opacity: '0', pointerEvents: 'none' }
      : {}
  }

  const onConsoleToggleClick = isshow => {
    setResultHeight(resultHeight < window.innerHeight - 48 - 30 ? window.innerHeight - 48 - 30 : 300)
  }
  const onConsoleLog = args => {
    consoleDispatch({ type: 'add', item: args })
  }

  const onToggleProjectPane = () => {
    setShowProjectPane(!showProjectPane)
  }
  const onFilenameChange = e => {
    setOceConfig(c => ({ ...c, filename: e.target.value }))
  }

  const onLayoutEditors = () => {
    JSEditor.current && JSEditor.current.layout()
    CSSEditor.current && CSSEditor.current.layout()
    HTMLEditor.current && HTMLEditor.current.layout()
  }

  const onJSCodeChange = ({ code }) => setJSCode(code)
  const onCSSCodeChange = ({ code }) => setCSSCode(code)
  const onHTMLCodeChange = ({ code }) => setHTMLCode(code)

  // 运行代码
  const onRunCode = () => {
    consoleDispatch({ type: 'clear' })
    resultSandboxRef.current.runCode({
      JS: JSCode,
      CSS: CSSCode,
      HTML: HTMLCode
    })
  }

  // 保存代码
  const onSaveCode = () => {
    message.success('代码已保存', 0.5)
    SaveJSProject({
      path: openedProjectPath,
      config: { ...oceConfig, updateAt: new Date().valueOf() },
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
        <EditorSetting show={showSetting} onClose={() => setShowSetting(false)} />
        <div className="container__leftside">
          <ProjectPane
            show={showProjectPane}
            onToggle={onToggleProjectPane}
            filename={oceConfig.filename}
            onFilenameChange={onFilenameChange}
          />
        </div>
        <div className="container__rightside">
          <EditorMenu
            onRun={onRunCode}
            onSave={onSaveCode}
            onSetting={() => setShowSetting(true)}
            currentEditor={currentEditor}
            onSwitchEditor={editor => setCurrentEditor(editor)}
          />
          <div className="container__rightside__inner">
            <div className="monaco-container">
              <div style={getEditorStyle('html')}>
                <MonacoEditor
                  ref={HTMLEditor}
                  language="html"
                  onChange={onHTMLCodeChange}
                  defaultValue={HTMLCode}
                />
              </div>
              <div style={getEditorStyle('css')}>
                <MonacoEditor
                  ref={CSSEditor}
                  language="css"
                  onChange={onCSSCodeChange}
                  defaultValue={CSSCode}
                />
              </div>
              <div style={getEditorStyle('javascript')}>
                <MonacoEditor
                  ref={JSEditor}
                  language="javascript"
                  onChange={onJSCodeChange}
                  defaultValue={JSCode}
                />
              </div>
            </div>
            <div className="debug-container">
              <Resizable
                enable={{ left: true }}
                size={{ width: debugWidth }}
                onResizeStop={(e, dir, ref, d) => {
                  setDebugWidth(prev => prev + d.width)
                }}
              >
                <div className="debug-container__anchor"></div>
                <div className="result-container">
                  <Resizable
                    enable={{ bottom: true }}
                    size={{ height: resultHeight }}
                    maxHeight={window.innerHeight - 48 - 30}
                    onResizeStop={(e, dir, ref, d) => {
                      setResultHeight(prev => prev + d.height)
                    }}
                  >
                    <IframeJSSandbox
                      ref={resultSandboxRef}
                      onConsoleLog={onConsoleLog}
                    />
                  </Resizable>
                </div>
                <div className="console-container">
                  <Console onToggleClick={onConsoleToggleClick}>
                    <Scrollbars
                      style={{
                        height: `calc(100vh - 30px - ${resultHeight}px)`
                      }}
                    >
                      {consoleData.content.map((item, index) => {
                        return <div key={index}> > {item.join(',')}</div>
                      })}
                    </Scrollbars>
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
