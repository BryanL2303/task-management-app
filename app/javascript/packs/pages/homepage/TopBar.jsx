import React, { useState, useEffect, useContext } from 'react'
import { AccountStateContext } from './context/AccountStateContext'
import { HomePageStateContext } from './context/HomePageStateContext'
import { DashboardStyleContext } from './context/DashboardStyleContext'
import { ProjectboardStyleContext } from './context/ProjectboardStyleContext'
import { ProjectDescriptionStyleContext } from './context/ProjectDescriptionStyleContext'
import { ProjectTaskListStyleContext } from './context/ProjectTaskListStyleContext'
import { SideBarStyleContext } from './context/SideBarStyleContext'

const TopBar = () => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [homePageState, setHomePageState] = useContext(HomePageStateContext)
  const [dashboardStyle, setDashboardStyle] = useContext(DashboardStyleContext)
  const [projectboardStyle, setProjectboardStyle] = useContext(ProjectboardStyleContext)
  const [projectDescriptionStyle, setProjectDescriptionStyle] = useContext(ProjectDescriptionStyleContext)
  const [projectTaskListStyle, setProjectTaskListStyle] = useContext(ProjectTaskListStyleContext)
  const [sideBarStyle, setSideBarStyle] = useContext(SideBarStyleContext)
  
  const [sideBarHidden, setSideBarHidden] = useState(false)
  const [projectTaskListHidden, setProjectTaskListHidden] = useState(false)
  const [accountName, setAccountName] = useState("loading")

  useEffect(() => {
    if (screen.width <= 500) {
      setSideBarHidden(true)
    }
  }, [])

  useEffect(() => {
    if (accountState != null) {
      setAccountName(accountState.name)
    }
  }, [accountState])

  function toggleSideBar(e) {
    if (sideBarHidden == false) {
      setSideBarStyle({
        visibility: 'hidden'
      })
      setSideBarHidden(true)
      setDashboardStyle({
        width: '100%',
        left: '0%',
        visibility: 'visible'
      })
      setProjectboardStyle({
        width: '100%',
        left: '0%',
        visibility: 'visible'
      })
    }
    else {
      setSideBarStyle({
          visibility: 'visible'
        })
      setSideBarHidden(false)
      if (screen.width <= 500) {
        setDashboardStyle({
          visibility: 'hidden'
        })
        setProjectboardStyle({
          visibility: 'hidden'
        })
      }
      else {
        setDashboardStyle({
          width: '75%',
          left: '25%'
        })
        setProjectboardStyle({
          width: '75%',
          left: '25%'
        })
      }
    }
  }

  function toggleProjectTaskList() {
    if (projectTaskListHidden == false) {
      setProjectDescriptionStyle({
        width: '100%'
      })
      setProjectTaskListStyle({
        width: '0%',
        visibility: 'hidden'
      })
      setProjectTaskListHidden(true)  
    }
    else {
      setProjectDescriptionStyle({
        width: '50%'
      })
      setProjectTaskListStyle({
        width: '50%',
        visibility: 'visible'
      })
      setProjectTaskListHidden(false)
    }
  }

  function showTutorial (e) {
    window.location.href = '/tutorial'
  }

  function logOut () {
    sessionStorage.clear()
    window.location.href = '/'
  }

  const UserMenu = () => {
    return(
      <div className='user-menu'>
        {screen.width > 500 &&
          <button className="tutorial--button" onClick={showTutorial}> ? </button>}
        <h1>{accountName}</h1>
        <button className="log-out--button" onClick={logOut}>Log Out</button>
      </div>
    )
  }

  return(
    <nav id='topbar-container' className='topbar-container'>
      <button onClick={toggleSideBar}>Sidebar</button>
      {homePageState=='project' && screen.width > 500 && <button onClick={toggleProjectTaskList}>Task List</button>}
      <UserMenu/>
    </nav>
  )
}

export { TopBar }