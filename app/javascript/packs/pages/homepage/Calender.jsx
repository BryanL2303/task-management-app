import React, { useState, useEffect, useContext } from 'react'
import {CalenderDay} from './calender/CalenderDay'
import { AccountStateContext } from './context/AccountStateContext'
import axios from 'axios'

const Calender = () => {
  let today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [dates, setDates] = useState()
  const [tasks, setTasks] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)

  useEffect(() => {
    axios.get('/api/calender/2000-01-01/append_next_year')
    .then( resp => {
    })
    .catch(resp => console.log(resp))    
  }, [])

  useEffect(() => {
    getTasksOnCalender(month, year)
  }, [month])

  useEffect(() => {
    if (tasks != null) {
      getMonthDates(month, year)      
    }
  }, [tasks])

  function reRenderCalender() {
    getTasksOnCalender(month, year)
  }

  function getMonthDates(month, year) {
    axios.post('/api/calender/2000-01-01/get_month_dates', {'mon': month, 'year': year})
    .then( resp => {
       setDates(resp.data.data)
       sessionStorage.setItem('calenderDates', JSON.stringify(resp.data.data))
    })
    .catch(resp => console.log(resp))
  }

  function getTasksOnCalender(month, year) {
   axios.post('/api/account/' + accountState.id + '/get_tasks_on_calender', {'mon': month, 'year': year})
    .then( resp => {
       setTasks(resp.data.data)
       sessionStorage.setItem('calenderTasks', JSON.stringify(resp.data.data))
    })
    .catch(resp => console.log(resp)) 
  }

  function showPreviousMonth (e) {
    if (month == 1) {
      setYear(year - 1)
      setMonth(12)
    }
    else {
      setMonth(month - 1)
    }
  }

  function showNextMonth (e) {
    if (month == 12) {
      setYear(year + 1)
      setMonth(1)
    }
    else {
      setMonth(month + 1)
    }
  }

  return(
    <div className='calender__container'>
      <div className= 'calender__header'>
        <button className='prev-month--button' onClick={showPreviousMonth}>Last Month</button>
        <label>{month}-{year}</label>
        <button onClick={showNextMonth}>Next Month</button>
        <ul>
          <li>Sunday</li>
          <li>Monday</li>
          <li>Tuesday</li>
          <li>Wednesday</li>
          <li>Thursday</li>
          <li>Friday</li>
          <li>Saturday</li>
        </ul>
      </div>
      
      <div className='calender__dates-container'>
        {dates != null && dates.map((week) => {
          return(
            <ul>
              {week.map((day) => {
                if (day != null) {
                  return (
                    <CalenderDay day={day} tasks={tasks} reRenderCalender={reRenderCalender}/>
                  )
                }
                else {
                  return(
                    <li className='null'>null</li>
                  )
                }
              })}
            </ul>
          )        
        })}
      </div>
    </div>
  )
}

export { Calender }