import React from "react"
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useRouteMatch
} from "react-router-dom"

import MainMenu from "./componets/MainMenu"
import Explorer from "./views/ExplorerView"
import Trashbin from "./views/TrashbinView"
import Setting from "./views/SettingView"
import EditorView from "./views/EditorView"

const Loading = () => {
  const history = useHistory()
  history.replace('/explorer')
  return (
    <div>
      Loading Page...
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