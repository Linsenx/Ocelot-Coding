import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react'
import { noop } from '../../utils/func'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'
import ThemeAtomLight from './theme-atom-light'
monaco.editor.defineTheme('Atom-Light', ThemeAtomLight)

const MonacoEditor = forwardRef((props, ref) => {
  let { language, onChange, defaultValue } = props
  const containerRef = useRef()
  const [editor, setEditor] = useState({})

  const initMonaco = () => {
    console.log('monaco init')
    const editor = monaco.editor.create(containerRef.current, {
      fontSize: 14,
      theme: 'Atom-Light',
      language: language,
      value: defaultValue,
      minimap: { enabled: false }
    })
    editor.getModel().updateOptions({ tabSize: 2 })
    editor.onDidChangeModelContent(event => {
      onChange({ code: editor.getValue(), event })
    })
    setEditor(editor)
  }

  useEffect(() => {
    initMonaco()
  }, [])

  useEffect(() => {
    setValue(defaultValue)
  }, [editor])

  const layout = () => {
    editor && editor.layout && editor.layout()
  }

  const setValue = newValue => {
    editor && editor.setValue && editor.setValue(newValue)
  }

  useImperativeHandle(ref, () => ({
    layout,
    setValue,
    editor
  }))

  return (
    <React.Fragment>
      <style jsx>{`
        .monaco-editor-container {
          overflow: hidden;
          height: 100%;
        }
      `}</style>
      <div ref={containerRef} className="monaco-editor-container"></div>
    </React.Fragment>
  )
})

MonacoEditor.defaultProps = {
  defaultValue: '',
  language: 'javascript',
  onChange: noop
}

export default React.memo(MonacoEditor)
