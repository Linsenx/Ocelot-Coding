const ExplorerMenu = [
  {
    key: 'open',
    title: '打开',
    mode: ['edit'],
    filetype: ['folder', 'jsproject']
  },
  {
    key: 'edit',
    title: '编辑',
    mode: ['edit'],
    filetype: ['jsproject']
  },
  {
    key: 'remove-soft',
    title: '删除',
    mode: ['edit'],
    filetype: ['folder', 'jsproject']
  },
  {
    key: 'new',
    title: '新建',
    icon: 'caret-right',
    mode: ['create'],
    filetype: ['default', 'folder', 'jsproject'],
    children: [
      {
        key: 'new-folder',
        title: '文件夹'
      },
      {
        key: 'new-jsproject',
        title: 'JS项目'
      }
    ]
  },
  {
    key: 'rename',
    title: '重命名',
    mode: ['edit'],
    filetype: ['folder', 'jsproject']
  }
]

const TrashbinMenu = [
  {
    key: 'unremove',
    title: '恢复',
    mode: ['edit'],
    filetype: ['folder', 'jsproject']
  },  
  {
    key: 'remove-hard',
    title: '删除',
    mode: ['edit'],
    filetype: ['folder', 'jsproject']
  }
]

export {
  ExplorerMenu,
  TrashbinMenu
}