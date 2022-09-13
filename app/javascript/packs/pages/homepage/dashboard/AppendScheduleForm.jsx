import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const AppendScheduleForm = ({date_id, reRenderDate}) => {
  const [displayForm, setDisplayForm] = useState(false)
  const [time, setTime] = useState()
  const [name, setName] = useState()
  const [priority, setPriority] = useState()
  const [description, setDescription] = useState("")
  const [accountState, setAccountState] = useContext(AccountStateContext)

  function changeTime(e) {
    setTime(e.target.value)
  }
  function changeName(e) {
    setName(e.target.value)
  }
  function changePriority(e) {
    setPriority(e.target.value)
  }
  function changeDescription(e) {
    setDescription(e.target.value)
  }

  function showForm(){
    setDisplayForm(true)
  }

  function hideForm(e){
    if(e.relatedTarget == null || !("form" in e.relatedTarget)){
      setDisplayForm(false)  
    }
  }
    
  function submitForm(e) {
    e.preventDefault()
    const checkPrioritySyntax = parseInt(priority)
    const checkTimeSyntax = parseInt(time)
    let errorMessage = ""
    if (isNaN(checkPrioritySyntax)
     || 0 > checkPrioritySyntax || checkPrioritySyntax > 3) {
      errorMessage = errorMessage + "Priority setting must be int between 0 - 3,\n"
    }
    if (isNaN(checkTimeSyntax) || time.length != 4) {
      errorMessage = errorMessage + "Time setting must be 4 int referencing 24 hour time"
    }
    if (errorMessage == "") {
      postCreateTask()      
    }
    else {
      alert(errorMessage)
    }
  }

  function postCreateTask() {
    axios.post('/api/task/1/create_task', {
      task_name: name,
      task_priority: priority,
      task_description: description,
      time: time,
      scheduled: true,
      calender_id: date_id,
      account_id: accountState.id
    })
    .then(resp => {
      reRenderDate()
      document.getElementsByClassName('form--time')[0].focus()
      document.getElementsByClassName('form--time')[0].value = ''
      document.getElementsByClassName('form--name')[0].value = ''
      document.getElementsByClassName('form--priority')[0].value = ''
      document.getElementsByClassName('form--description')[0].value = ""
      setTime()
      setName()
      setPriority()
      setDescription("")
    })
    .catch(resp => console.log(resp))
  }

  if (displayForm == true) {
    return(
      <form className='form' onSubmit={submitForm} onBlur={ hideForm }>
        <input className='form--time' placeholder='time' onChange={changeTime}></input>
        <input className='form--name' placeholder='task_name' onChange={changeName}></input>
        <input className='form--priority' placeholder='task_priority' onChange={ changePriority }></input>
        <textarea className='form--description' placeholder='task_description' onChange={changeDescription}></textarea>
        <button>Add New Task</button>
      </form>
    )
  }
  else {
    return(
      <div id={date_id} onClick={ showForm }>Click to add task</div>
    )
  }
}

export { AppendScheduleForm }