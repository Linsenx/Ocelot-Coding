import React, { useContext, useReducer } from "react"
import { OPEN_PROJECT } from "./action"

const initialState = {
  // 当前被打开项目路径
  openedProjectPath: ''
}

function reducer(state, action) {
  switch (action.type) {
    case OPEN_PROJECT:
      return { ...state, openedProjectPath: action.path }
      
  }
}

const StateContext = React.createContext()
const StateProvider = ({ children }) => (
  <StateContext.Provider value={ useReducer(reducer, initialState) }>
    { children }
  </StateContext.Provider>
)
const useStateValue = () => useContext(StateContext)

export { useStateValue, StateProvider }