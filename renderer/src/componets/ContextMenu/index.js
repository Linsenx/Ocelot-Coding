import React, { useEffect } from "react"
import Cascader from "../Cascader"

export default (props = {}) => {
  const menuSource = [
    {
      key: 0,
      title: '打开',
      mode: ['edit'],
      filetype: ['folder', 'jsproject']
    },    
    {
      key: 1,
      title: '编辑',
      mode: ['edit'],
      filetype: ['jsproject']
    },
    {
      key: 2,
      title: '删除',
      mode: ['edit'],
      filetype: ['folder', 'jsproject']
    },
    {
      key: 3,
      title: '新建',
      icon: 'caret-right',
      mode: ['create'],
      filetype: ['default', 'folder', 'jsproject'],
      children: [
        {
          key: 31,
          title: '文件夹',
        },
        {
          key: 32,
          title: 'JS项目'
        }        
      ]
    },
    {
      key: 4,
      title: '重命名',
      mode: ['edit'],
      filetype: ['folder', 'jsproject']
    }
  ]

  const { position, filetype = 'default', mode, onClick } = props

  let source = menuSource.filter(
    s => s.mode.includes(mode) && 
    s.filetype.includes(filetype)
  )

  return <Cascader key={source} options={source} position={position} onClick={onClick} />
}