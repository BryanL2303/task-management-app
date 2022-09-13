import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ScheduledTask } from './ScheduledTask'
import { AppendScheduleForm } from './AppendScheduleForm'
import { AccountStateContext } from '../context/AccountStateContext'
import { DashboardStateContext } from '../context/DashboardStateContext'

const DailyTimetable = ({ index, reRenderPage }) => {
  const [dailyTasks, setDailyTasks] = useState([])
  const [day, setDay] = useState({id: 'loading', attributes: {date: "loading"}})
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [dashboardState, setDashboardState] = useContext(DashboardStateContext)

  useEffect(() => {
    if (dashboardState[index] != null) {
      setDay(dashboardState[index])
    }
  }, [dashboardState[index]])

  useEffect((prevDay) => {
    if (day.id == "loading" && sessionStorage.getItem(`dailyTasks${day.id}`) != null) {
      setDailyTasks(JSON.parse(sessionStorage.getItem(`dailyTasks${day.id}`)))
    }
    else if (day.id != "loading" &&
      sessionStorage.getItem(`dailyTasks${day.id}`) != null &&
      day.relationships.tasks.data.length == JSON.parse(sessionStorage.getItem(`dailyTasks${day.id}`)).length) {
      setDailyTasks(JSON.parse(sessionStorage.getItem(`dailyTasks${day.id}`)))
    }
    else if (day.id != "loading") {
      fetchDailyTasks()
    }
  }, [day])

  function fetchDailyTasks() {
    axios.get('/api/account/' + accountState.id + '/getTasksByDate/' + day.id)
    .then( resp => {
      setDailyTasks(resp.data.data)
      sessionStorage.setItem(`dailyTasks${day.id}`, JSON.stringify(resp.data.data))
    })
    .catch(resp => console.log(resp))
  }

  return(    
    <div id={ day.id } className= 'date'>
      <h1 id={ day.id }>{ day.attributes.date }</h1>
      {dailyTasks.map((task)=> {
        return(
          <ScheduledTask key={ task.id } task_id={ task.id } reRenderPage={ reRenderPage } reRenderDate={ fetchDailyTasks }/>
        )
      })}
      
      <AppendScheduleForm date_id={ day.id } reRenderDate={ fetchDailyTasks }/>
    </div>
  )
}

export { DailyTimetable }