import React from "react"
import Routes from "./src/routes"
import WindowController from "./src/componets/WindowController"
import { StateProvider } from "./src/reducer"
import { library } from "@fortawesome/fontawesome-svg-core"
import {faJsSquare} from "@fortawesome/free-brands-svg-icons/faJsSquare"
import {faFolder} from "@fortawesome/free-solid-svg-icons/faFolder"
library.add(faJsSquare, faFolder)


const App = () => {
  return (
    <StateProvider>
      <WindowController />
      <Routes />
    </StateProvider>
  )
}

export default React.memo(App)