import React from "react"
import { Breadcrumb, Icon } from "antd"

const navigation =  (props = {}) => {
  const { path = '', onChangePath = ()=>{}, pathToNameMap = new Map() } = props
  const folder = path.slice(path.indexOf('/project') + 8)
  const folderArr = folder.split('/')
  const getFolders = () => folderArr.filter(f => f.length > 0)

  return (
    <React.Fragment>
      <style jsx>{`
        .nav {
          display: flex;
          align-items: center;
          height: 44px;
          padding-left: 16px;
          margin-left: -257px;
          background: #fff;
          border-bottom: 1px solid #E8E8E8;
        }
      `}</style>
      <div className="nav">
        <Breadcrumb style={{ WebkitAppRegion: 'no-drag' }}>
          <Breadcrumb.Item onClick={()=>onChangePath('')}>
            <Icon type="home" />
            <span style={{ marginLeft: 10 }}>工程目录</span>
          </Breadcrumb.Item>

          {
            getFolders().map((foldername, index) => (
              <Breadcrumb.Item 
                key={index} 
                onClick={()=>onChangePath(getFolders().slice(0, index + 1).join('/'))}
              >
                {pathToNameMap[foldername]}
              </Breadcrumb.Item>
            ))
          }
        </Breadcrumb>
      </div>
    </React.Fragment>
  )
}

export default React.memo(navigation)