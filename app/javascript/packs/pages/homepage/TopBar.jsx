import React, { useState, useEffect, useContext } from 'react'
import { AccountStateContext } from './context/AccountStateContext'
import { HomePageStateContext } from './context/HomePageStateContext'
import {image} from './sidebar-icon.jpg'

const TopBar = () => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [homePageState, setHomePageState] = useContext(HomePageStateContext)
  const [accountName, setAccountName] = useState("loading")

  useEffect(() => {
    if (accountState != null) {
      setAccountName(accountState.name)
    }
  }, [accountState])

  useEffect(() => {
    let userMenu = document.getElementsByClassName('user-menu')[0]
    userMenu.style['visibility'] = 'hidden'
  }, [accountName])

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
        <button className="log-out--button" onClick={logOut}>Log Out</button>
      </div>
    )
  }

  function showUserMenu(e) {
    let userMenu = document.getElementsByClassName('user-menu')[0]
    if (userMenu.style['visibility'] == 'hidden') {
      userMenu.style['visibility'] = 'visible'
    }
    else {
      userMenu.style['visibility'] = 'hidden'
    }
  }

  return(
    <nav id='topbar-container' className='topbar-container'>
      <button className='sidebar--button' onClick={toggleSideBar}><img src="/packs/media/packs/pages/homepage/sidebar-icon-d04f396ba76b9667ee34744d3127b961.jpg"/></button>
      {homePageState=='project' && screen.width > 500 && <button onClick={toggleProjectTaskList}>Task List</button>}
      
      <div className='user-component'>
      {screen.width > 500 &&
          <button className="tutorial--button" onClick={showTutorial}> ? </button>}
      <h1 className='account-name__label'>{accountName}</h1>
      <button className='show-menu--button' onClick={showUserMenu}><img src="/packs/media/packs/pages/homepage/user-menu-icon-bc529dc1442054ce8a7db5ccc2846bb7.jpg"/></button>
      <UserMenu/>
      </div>
    </nav>
  )
}

export { TopBar }