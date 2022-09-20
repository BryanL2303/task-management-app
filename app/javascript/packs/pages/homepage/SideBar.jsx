import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ProjectForm } from './sidebar/ProjectForm'
import { AccountStateContext } from './context/AccountStateContext'
import { ProjectListContext } from './context/ProjectListContext'

const SideBar = ({ showDashboard, showProjectboard }) => {
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [projects, setProjects] = useContext(ProjectListContext)

  useEffect(() => {
    if (accountState != null && sessionStorage.getItem('projectList') == null) {
      fetchProjects()
    }
  }, [accountState])

  function fetchProjects() {
    axios.get('/api/account/' + accountState.id + '/projects')
    .then(resp => {
      setProjects(resp.data.data)
      sessionStorage.setItem('projectList', JSON.stringify(resp.data.data))
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div className='sidebar-container'>
      <div className='projects-container'>
        <button onClick={ showDashboard }>Dashboard</button>
        {projects.map((project) => {
          return(
            <button key={project.id} id={project.id} onClick={ showProjectboard }>{ project.attributes.project_name }</button>
          )
        })}
        
        <ProjectForm fetchProjects={ fetchProjects }/>
      </div>
    </div>
  )
}

export { SideBar }