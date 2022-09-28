import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { DailyTimetable } from './dashboard/DailyTimetable'
import { UnscheduledTask } from './dashboard/UnscheduledTask'
import { AppendToDoListForm } from './dashboard/AppendToDoListForm'
import { AccountStateContext } from './context/AccountStateContext'
import { DashboardStateContext } from './context/DashboardStateContext'
import { UnscheduledTasksList } from './context/UnscheduledTasksList'

const Dashboard = () => {
  const iteration = [0, 1, 2, 3, 4, 5, 6]
  const [calender, setCalender] = useState([])
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [dashboardState, setDashboardState] = useContext(DashboardStateContext)
  const [unscheduledTasks, setUnscheduledTasks] = useContext(UnscheduledTasksList)

  useEffect(() => {
    if (sessionStorage.getItem('dashboardState') == null) {
      fetchCalender()
    }
    else {
      let date = new Date()
      let cache = new Date(dashboardState[0].attributes.date)
      if (cache.getDate() != date.getDate()) {
        fetchCalender() 
      }
    }
    if (sessionStorage.getItem('unscheduledTasks') == null) {
      fetchUnscheduledTasks()
    }
    else{
      setUnscheduledTasks(JSON.parse(sessionStorage.getItem("unscheduledTasks")))
    }
  }, [])

  function fetchCalender() {
    axios.get('/api/calender/2000-01-01/set_week_dates')
    .then( resp => {
      setDashboardState(resp.data.data)
      sessionStorage.setItem("dashboardState", JSON.stringify(resp.data.data))
    })
    .catch(resp => console.log(resp))
  }

  function fetchUnscheduledTasks() {
    axios.get('/api/account/' + accountState.id + '/get_unscheduled_tasks')
    .then(resp => {
      if (resp.data.data != null) {
        setUnscheduledTasks(resp.data.data)
        sessionStorage.setItem("unscheduledTasks", JSON.stringify(resp.data.data))
      }
    })
    .catch(resp => console.log(resp))
  }

  function reRenderPage() {
    fetchCalender()
    fetchUnscheduledTasks()
  }

  return(
    <div className='dashboard-container'>
      <div className= 'dailytimetable-container'>
        {iteration.map(index => {
          return(
            <DailyTimetable key={index} index={index} reRenderPage={reRenderPage}/>
          )
        })}
      </div>
      
      <div className='othertasks-container'>
        <h1 id="unscheduled">Unscheduled Tasks</h1>
        {unscheduledTasks.map((task)=> {
          return(
            <UnscheduledTask key={task.id} task_id={task.id} reRenderPage={reRenderPage} reRenderList={fetchUnscheduledTasks}/>
          )
        })}
        
        <AppendToDoListForm reRenderList={fetchUnscheduledTasks}/>
      </div>
    </div>
  )
}

export { Dashboard }