import React from 'react'
import { Breadcrumb, Icon } from 'antd'
import { noop } from '../../utils/func'
const Path = window.require('path')

const navigation = props => {
  const { path, rootPath, rootIcon, rootText, onChangePath, pathToNameMap } = props

  const relativePath = Path.relative(rootPath, path)
  const currentFolders = relativePath.split(Path.sep)
  const getFolders = () => currentFolders.filter(f => f.length > 0)

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
          border-bottom: 1px solid #e8e8e8;
        }
      `}</style>
      <div className="nav">
        <Breadcrumb style={{ WebkitAppRegion: 'no-drag' }}>
          <Breadcrumb.Item onClick={() => onChangePath('')}>
            <Icon type={rootIcon} />
            <span style={{ marginLeft: 10 }}>{rootText}</span>
          </Breadcrumb.Item>

          {getFolders().map((foldername, index) => (
            <Breadcrumb.Item
              key={index}
              onClick={() =>
                onChangePath(
                  getFolders()
                    .slice(0, index + 1)
                    .join('/')
                )
              }
            >
              {pathToNameMap[foldername]}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
    </React.Fragment>
  )
}
navigation.defaultProps = {
  path: '',
  onChangePath: noop,
  pathToNameMap: new Map(),
  rootIcon: 'home',
  rootText: '工程目录'
}

export default React.memo(navigation)
