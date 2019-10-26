import React, { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';
import ThemeAtomLight from "./theme-atom-light"
monaco.editor.defineTheme('Atom-Light', ThemeAtomLight)

const voidFunc = () => {}

const MonacoEditor = (props) => {
  let { language, onChange } = props
  const containerRef = useRef()
  const [editor, setEditor] = useState({})

  const initMonaco = () => {
    console.log('monaco init')
    const editor = monaco.editor.create(containerRef.current, {
      fontSize: 14,
      theme: 'Atom-Light',
      language: language,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true
    })
    editor.getModel().updateOptions({ tabSize: 2 })
    editor.onDidChangeModelContent(event => {
      onChange({ code: editor.getValue(), event })
    })
    setEditor(editor)
  }

  useEffect (() => {
    initMonaco()
  }, [])

  return (
    <React.Fragment>
      <style jsx>{`
        .monaco-editor-container {
          overflow: hidden;
          height: 100%;
        }    
      `}</style>
      <div
        ref={containerRef}
        className="monaco-editor-container"
      ></div>
    </React.Fragment>
  )
}

MonacoEditor.defaultProps = {
  language: 'javascript',
  onChange: voidFunc
}

export default React.memo(MonacoEditor)
