import React from "react"
import { Breadcrumb, Icon } from "antd"

export default (props = {}) => {
  const { path = '', onChangePath = ()=>{} } = props
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
        }
      `}</style>
      <div className="nav">
        <Breadcrumb style={{ WebkitAppRegion: 'no-drag' }}>
          <Breadcrumb.Item onClick={()=>onChangePath('')}>
            <Icon type="home" />
          </Breadcrumb.Item>

          {
            getFolders().map((foldername, index) => (
              <Breadcrumb.Item 
                key={index} 
                onClick={()=>onChangePath(getFolders().slice(0, index + 1).join('/'))}
              >
                {foldername}
              </Breadcrumb.Item>
            ))
          }
        </Breadcrumb>
      </div>
    </React.Fragment>
  )
}