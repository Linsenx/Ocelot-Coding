import React, { useState } from "react"
import { Icon } from "antd"
import "./index.css"

const Cascader = (props) => {
  const [activeOptions, setActiveOptions] = useState([props.options])
  const [activePath, setActivePath] = useState([0])
  const [activeHistory, setActiveHistory] = useState([])

  const isActive = (menuIndex, optionIndex) => {
    return activeHistory.includes({ menuIndex, optionIndex })
  }

  const handleExpandMenu = (menuIndex, optionIndex) => {
    const option = activeOptions[menuIndex][optionIndex]
    setActiveHistory([...activeHistory, { menuIndex, optionIndex, hasChildren: option.children !== undefined }])

    let localActiveOptions = activeOptions
    let localActivePath = activePath
    if (activeHistory.length > 0) {
      const lastActive = activeHistory.pop()
      // 关闭菜单的两种条件
      // 1.同层菜单之间的切换
      // 2.从深层菜单回到低层菜单
      if (activeOptions.length > 1 && 
          (lastActive.menuIndex === menuIndex && lastActive.optionIndex !== optionIndex) ||
          (lastActive.menuIndex > menuIndex)
        ) {
        // 关闭深层菜单前，确保当前指向菜单之后有深层菜单
        if (localActiveOptions.length > menuIndex + 1) {
          localActiveOptions.splice(menuIndex + 1)
          localActivePath.splice(menuIndex + 1)
        }
      }
    }

    if (option.children !== undefined && !activeOptions.includes(option.children)) {
      localActiveOptions.push(option.children)
      localActivePath.push(optionIndex)
    }
    setActiveOptions(localActiveOptions)
    setActivePath(localActivePath)
  }

  const getOption = (option, menuIndex, optionIndex) => {
    const { onClick = () => {} } = props

    return (
      <li 
        key={menuIndex+'_'+optionIndex}
        className={`oce-cas__menu__item ${isActive(menuIndex, optionIndex) ? "oce-cas__menu__item__active" : null }`}
        onMouseOver={() => handleExpandMenu(menuIndex, optionIndex)}
        onClick={() => onClick(option) }
      >
        {option.title}{option.icon && <Icon type={option.icon} />}
      </li>
    )
  }

  const getPosition = (menuIndex) => {
    const { position } = props
    const topShiffting = menuIndex > 0 ? 
      activePath.slice(0, menuIndex + 1).reduce((a, b) => a + b) : 0;
    const top = position.top + 40 * topShiffting
    const left = position.left + 120 * menuIndex
    return { top, left }
  }

  return (
    <div className="oce-cas__menus">
      {
        activeOptions.map((options, menuIndex) => (
          <ul key={menuIndex} className="oce-cas__menu" style={getPosition(menuIndex)}>
            { options.map((option, optionIndex) => getOption(option, menuIndex, optionIndex)) }
          </ul>
        ))
      }
    </div>
  )
}

export default Cascader