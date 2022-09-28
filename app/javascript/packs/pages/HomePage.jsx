import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { TopBar } from './homepage/TopBar'
import { SideBar } from './homepage/SideBar'
import { Dashboard } from './homepage/Dashboard'
import { Projectboard } from './homepage/Projectboard'
import { Calender } from './homepage/Calender'
import { AccountStateContext } from './homepage/context/AccountStateContext'
import { HomePageStateContext } from './homepage/context/HomePageStateContext'
import { CurrentDisplayProjectContext } from './homepage/context/CurrentDisplayProjectContext'
import { ProjectListProvider } from './homepage/context/ProjectListContext'
import { DashboardStateProvider } from './homepage/context/DashboardStateContext'
import { UnscheduledTasksProvider } from './homepage/context/UnscheduledTasksList'

const HomePage = () => {
  //If there is no ongoing session go to login page
  if (sessionStorage.getItem('id') == null) {
    window.location.href = '/'
  }

  //Both states used to render components of main block
  const [currentDisplayProjectState, setCurrentDisplayProjectState] = useContext(CurrentDisplayProjectContext)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [homePageState, setHomePageState] = useContext(HomePageStateContext)

  //Renders the dashboard
  function showDashboard(e) {
    setHomePageState("dashboard")
  }

  //Starts the process to render the project board
  function showProjectboard(e) {
    console.log()
    if (JSON.parse(sessionStorage.getItem(`project${e.target.id}`)) == null) {
      fetchProject(e.target.id)
    }
    else {
      setCurrentDisplayProjectState(JSON.parse(sessionStorage.getItem(`project${e.target.id}`)))
    }
  }

  //Gets the information of the project to be rendered
  //from the database.
  function fetchProject(project_id) {
    axios.get('/api/project/' + project_id)
    .then(resp => {
      setCurrentDisplayProjectState(resp.data.data)
      sessionStorage.setItem(`project${project_id}`, JSON.stringify(resp.data.data))
    })
    .catch(resp => console.log(resp))
  }
  
  //Waits for the project state to be set before rendering components
  useEffect(() => {
    if (currentDisplayProjectState != null && currentDisplayProjectState != 'undefined') {
      setHomePageState("project")
    }
  }, [currentDisplayProjectState])

  return(
    <div className='homepage-container'>
      <ProjectListProvider>
      <DashboardStateProvider>
      <UnscheduledTasksProvider>
        <TopBar/>
      	<SideBar showDashboard={ showDashboard } showProjectboard={ showProjectboard }/>
        {homePageState=="tutorial" && <Tutorial/>}
        {homePageState=="dashboard" && <Dashboard/>}
        {homePageState=="project" && <Projectboard project={ currentDisplayProjectState } showDashboard={ showDashboard } reRenderProject={ fetchProject }/>}
        {homePageState=="calender" && <Calender/>}
      </UnscheduledTasksProvider>
      </DashboardStateProvider>
      </ProjectListProvider>
    </div>
  )
}

export { HomePage }