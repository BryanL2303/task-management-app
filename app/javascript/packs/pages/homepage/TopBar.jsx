import React, { useState, useEffect, useContext } from 'react'
import { AccountStateContext } from './context/AccountStateContext'
import { HomePageStateContext } from './context/HomePageStateContext'

const TopBar = () => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [homePageState, setHomePageState] = useContext(HomePageStateContext)
  const [accountName, setAccountName] = useState("loading")

  useEffect(() => {
    if (accountState != null) {
      setAccountName(accountState.name)
    }
  }, [accountState])

  function toggleSideBar(e) {
    let sideBar = document.getElementsByClassName('sidebar-container')[0]
    let board
    if (sessionStorage.getItem('homePageState') == 'dashboard') {
      board = document.getElementsByClassName('dashboard-container')[0]
    }
    else if (sessionStorage.getItem('homePageState') == 'project') {
      board = document.getElementsByClassName('project__container')[0]
    }
    if (sideBar.style['visibility'] != 'hidden') {
      sideBar.style['visibility'] = 'hidden'   
      board.style['width'] = '100%'
      board.style['left'] = '0%'
      board.style['visibility'] = 'visible'
    }
    else {
      sideBar.style['visibility'] = 'visible'
      if (screen.width <= 500) {        
        board.style['visibility'] = 'hidden'
      }
      else {
        board.style['width'] = '75%'
        board.style['left'] = '25%'
      }
    }
  }

  function toggleProjectTaskList() {
    let projectDescription = document.getElementsByClassName('project__description')[0]
    let projectTaskList = document.getElementsByClassName('project__task-container')[0]
    if (projectTaskList.style['visibility'] != 'hidden') {
      projectDescription.style['width'] = '100%'
      projectTaskList.style['visibility'] = 'hidden'
    }
    else {
      projectDescription.style['width'] = '50%'
      projectTaskList.style['visibility'] = 'visible'
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