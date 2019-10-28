import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'
import { noop } from '../../utils/func'

const SanboxScript = `
parent.postMessage({ type: 'ready' }, '*')

console.log = (...args) => window.parent.postMessage({
  type: 'console.log',
  args
}, '*')

function runCode(code) {
  console.info('receive code: ' + code)
  try {
    eval(code)
  } catch (error) {
    console.log(error.toString())
  }
}

window.addEventListener('message', event => {
  const data = event.data || { type: undefined }
  
  switch (data.type) {
    case 'refresh':
      window.location.reload()
      break
    case 'runcode':
      runCode(data.code)
      break
  }
})
`

const BuildSanboxHTML = ({ JS = '', CSS = '', HTML = '', time = '' }) => `
<html>
  <head>
    <style>${CSS}</style>
    <title>${time}</title>
  </head>
  <body>
    ${HTML}
    <script>${SanboxScript}</script>
    <script>${JS}</script>
  </body>
</html>
`

const IframeSandbox = forwardRef((props, ref) => {
  const { onConsoleLog } = props
  const iframeRef = useRef()
  const [ codes, setCodes ] = useState({ JS: '', CSS: '', HTML: '', time: '' })

  const buildHTML = () => BuildSanboxHTML(codes)

  useEffect(() => {
    window.addEventListener('message', event => {
      const data = event.data || { type: undefined }
      switch (data.type) {
        case 'console.log':
          onConsoleLog(data.args)
          break
      }
    })
  }, [])

  // 在iframe中运行代码
  const runCode = ({ JS = '', CSS = '', HTML = '' }) => {
    setCodes({ JS, CSS, HTML, time: new Date().valueOf() })
  }

  // 暴露函数给父组件
  useImperativeHandle(ref, () => ({
    runCode
  }))

  return (
    <iframe
      ref={iframeRef}
      frameBorder="0"
      sandbox="allow-modals allow-forms allow-popups allow-scripts"
      width="100%"
      height="100%"
      srcDoc={buildHTML()}
    ></iframe>
  )
})
IframeSandbox.defaultProps = {
  onConsoleLog: noop
}

export default IframeSandbox
