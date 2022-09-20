import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const AppendScheduleForm = ({date_id, reRenderDate}) => {
  const [displayForm, setDisplayForm] = useState(false)
  const [accountState, setAccountState] = useContext(AccountStateContext)

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
    const checkTimeSyntax = parseInt(e.target[0].value)
    const checkPrioritySyntax = parseInt(e.target[2].value)
    let errorMessage = ""
    if (isNaN(checkPrioritySyntax)
     || 0 > checkPrioritySyntax || checkPrioritySyntax > 3) {
      errorMessage = errorMessage + "Priority setting must be int between 0 - 3,\n"
    }
    if (isNaN(checkTimeSyntax) || e.target[0].value.length != 4) {
      errorMessage = errorMessage + "Time setting must be 4 int referencing 24 hour time"
    }
    if (errorMessage == "") {
      postCreateTask(e.target)
    }
    else {
      alert(errorMessage)
    }
  }

  function postCreateTask(form) {
    axios.post('/api/task/1/create_task', {
      time: form[0].value,
      task_name: form[1].value,
      task_priority: form[2].value,
      task_description: form[3].value,      
      scheduled: true,
      calender_id: date_id,
      account_id: accountState.id
    })
    .then(resp => {
      reRenderDate()
      document.getElementsByClassName('form__time')[0].focus()
      document.getElementsByClassName('form__time')[0].value = ''
      document.getElementsByClassName('form__name')[0].value = ''
      document.getElementsByClassName('form__priority')[0].value = ''
      document.getElementsByClassName('form__description')[0].value = ""
    })
    .catch(resp => console.log(resp))
  }

  if (displayForm == true) {
    return(
      <form className='form' onSubmit={submitForm} onBlur={ hideForm }>
        <input className='form__time' placeholder='time'></input>
        <input className='form__name' placeholder='task_name'></input>
        <input className='form__priority' placeholder='task_priority'></input>
        <textarea className='form__description' placeholder='task_description'></textarea>
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