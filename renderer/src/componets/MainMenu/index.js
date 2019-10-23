import React from 'react'
import { useHistory } from 'react-router-dom'
import { Menu, Icon } from 'antd'
const { Item } = Menu

const menuSource = [
  { title: '代码管理器', path: '/explorer', icon: 'folder' },
  { title: '垃圾箱', path: '/explorer/trashbin', icon: 'delete' },
  { title: '软件设置', path: '/explorer/setting', icon: 'setting' },
]

const MainMenu = () => {
  const history = useHistory()
  const currentPath = history.location.pathname;
  const getMenuSource = () => menuSource
  
  const onChangePage = ({ item, key, keyPath }) => {
    history.push(key)
  }

  return (
    <React.Fragment>
      <style jsx>{`
        .container {
          height: 100vh;
          border-right: 1px solid #E8E8E8;
        }
      `}</style>
      <div className="container">
        <Menu
          style={{
            marginTop: '40px',
            width: '256px',
            height: '100vh',
            border: 'none',
          }}
          mode="inline"
          onClick={onChangePage}
          defaultSelectedKeys={[currentPath]}
        >
          {
            getMenuSource().map(menu => (
              <Item key={menu.path}>
                <Icon type={menu.icon} />
                <span>{menu.title}</span>
              </Item>
            ))
          }
        </Menu>
      </div>
    </React.Fragment>
  );
};

export default React.memo(MainMenu)