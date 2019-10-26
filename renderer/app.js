import React, { useReducer } from "react"
import Routes from "./src/routes"
import WindowController from "./src/componets/WindowController"
import "antd/dist/antd.css"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faJsSquare } from "@fortawesome/free-brands-svg-icons"
import { faFolder, faWindowMinimize, faWindowClose, faTimes } from "@fortawesome/free-solid-svg-icons"
import { StateProvider } from "./src/reducer"
library.add(faJsSquare, faFolder, faWindowMinimize, faWindowClose, faTimes)

const App = () => {
  return (
    <StateProvider>
      <WindowController />
      <Routes />
    </StateProvider>
  )
}

export default React.memo(App)