import React, { useEffect } from 'react'
import { Spin } from 'antd'
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory,
  useRouteMatch
} from 'react-router-dom'

import MainMenu from './componets/MainMenu'
import Explorer from './views/ExplorerView'
import Trashbin from './views/TrashbinView'
import Setting from './views/SettingView'
import EditorView from './views/EditorView'
import { initOceFolderAsync } from './utils/oceFolderInitialization'

const Loading = () => {
  const history = useHistory()

  useEffect(() => {
    initOceFolderAsync().then(() => {
      history.replace('/explorer')
    })
  }, [])

  return (
    <div className="container">
      <style jsx>{`
        .container {
          display: flex;
          height: 100vh;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      <Spin size="large" tip="努力加载中..."/>
    </div>
  )
}

const Home = () => {
  const { path, url } = useRouteMatch()
  return (
    <React.Fragment>
      <style jsx>{`
        .container {
          display: flex;
        }
      `}</style>
      <div className="container">
        <MainMenu />
        <Switch>
          <Route exact path={path} component={Explorer} />
          <Route exact path={`${path}/trashbin`} component={Trashbin} />
          <Route exact path={`${path}/setting`} component={Setting} />
        </Switch>
      </div>
    </React.Fragment>
  )
}

const Editor = () => {
  const { path, url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={path} component={EditorView} />
    </Switch>
  )
}

const routes = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={Loading} />
          <Route path="/explorer" component={Home} />
          <Route path="/editor" component={Editor} />
        </Switch>
      </Router>
    </React.Fragment>
  )
}

export default routes
