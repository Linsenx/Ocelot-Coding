import React, { useEffect } from 'react'
import Cascader from '../Cascader'
import { noop } from '../../utils/func'

const ContextMenu = props => {
  const { mode, contextSource, position, filetype, onClick } = props

  let source = contextSource.filter(
    s => s.mode.includes(mode) && s.filetype.includes(filetype)
  )

  return (
    <Cascader
      key={source}
      options={source}
      position={position}
      onClick={onClick}
    />
  )
}
ContextMenu.defaultProps = {
  mode: '',
  contextSource: [],
  // explorerMode: 'explorer',
  position: {},
  filetype: 'default',
  onClick: noop
}

export default React.memo(ContextMenu)
