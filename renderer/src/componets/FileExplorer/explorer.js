import React from 'react';
import dayjs from "dayjs"
import { Scrollbars } from "react-custom-scrollbars"
import { FILE_TYPE, ICONS } from "./constant"

const voidFunc = function() {}

const headerRender = () => (
  <div className="oce-file-explorer__table__head">
    <table style={{width: '100%'}}>
      <colgroup>
        <col style={{width: '50%'}} />
        <col style={{width: '30%', minWidth: '150px'}} />
        <col style={{width: '20%', minWidth: '100px'}} />
      </colgroup>
      <thead style={{position: 'sticky', top: '0px'}}>
        <tr>
          <th>文件名</th>
          <th>修改日期</th>
          <th>文件类型</th>
        </tr>
      </thead>
    </table>
  </div>
);

const fileNameFilter = filename => {
  return filename === '..' ? '..上级目录' : filename 
} 
const fileTypeFilter = filetype => {
  return FILE_TYPE[filetype] ? FILE_TYPE[filetype] : '未知类型'
}
const fileUpdateAtFilter = updateAt => {
  return updateAt ? dayjs (updateAt).format ('YYYY-MM-DD HH:mm:ss') : '-'
}

const rowRender = file => (
  <React.Fragment>
    <style jsx>{`
      td > img {
        margin-right: 10px;
        height: 28px;
      }
    `}</style>
    <td>
      <img src={ICONS[file.filetype]} style={{marginRight: '10px', height: '28px'}} />
      {fileNameFilter(file.filename)}
    </td>
    <td>{fileUpdateAtFilter(file.updateAt)}</td>
    <td>{fileTypeFilter(file.filetype)}</td>
  </React.Fragment>
)

const Explorer = props => {
  const { 
    scroll = { width: 0, height: 0 },
    // root = '',
    // currentPath = '',
    currentFiles = [],
    getRowClass = voidFunc,
    onRowClick = voidFunc,
    onRowDoubleClick = voidFunc,
    onRowContextMenu = voidFunc,
    onPlaceHolderClick = voidFunc,
    onPlaceHolderContextMenu = voidFunc
  } = props;

  return (
    <div className="oce-file-explorer__table">
      {headerRender()}
      <Scrollbars style={{height: scroll.height}}>
        <div className="oce-file-explorer__table__body">
          <table style={{width: '100%'}}>
            <colgroup>
              <col style={{width: '50%'}} />
              <col style={{width: '30%', minWidth: '150px'}} />
              <col style={{width: '20%', minWidth: '100px'}} />
            </colgroup>
            <tbody>
              {currentFiles.map ((file, index) => (
                <tr
                  draggable="true"
                  key={index}
                  className={getRowClass(index)}
                  onClick={event => onRowClick({ event, index, file })}
                  onDoubleClick={event => onRowDoubleClick({ event, index, file })}
                  onContextMenu={event => onRowContextMenu({ event, index, file })}
                >
                  {rowRender(file)}
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className="contextmenu-placeholder"
            style={{height: '200px'}}
            onClick={event => onPlaceHolderClick(event)}
            onContextMenu={event => onPlaceHolderContextMenu(event)}
          />
        </div>
      </Scrollbars>
    </div>
  );
};

export default React.memo(Explorer);
