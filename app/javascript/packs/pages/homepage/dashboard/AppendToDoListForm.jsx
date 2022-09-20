import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const AppendToDoListForm = ({ reRenderList }) => {
  const [displayForm, setDisplayForm] = useState(false)
  const [accountState, setAccountState] = useContext(AccountStateContext)

  function showForm(e) {
    setDisplayForm(true)
  }

  function hideForm(e) {
    if (e.relatedTarget == null || !("form" in e.relatedTarget)) {
      if (e.target.innerHTML != "Add New Task") {
        setDisplayForm(false)
      }  
    }
  }

  function submitForm(e) {
    e.preventDefault()
    const checkPrioritySyntax = parseInt(e.target[1].value)
    if ((!isNaN(checkPrioritySyntax)) 
      && ((0) <= checkPrioritySyntax && checkPrioritySyntax <= 3)) {
      postCreateTask(e.target)
    }
    else {
      alert("Priority setting must be int between 0 - 3")
    }
  }

  function postCreateTask(form) {
    axios.post('/api/task/1/create_task', {
      task_name: form[0].value,
      task_priority: form[1].value,
      task_description: form[2].value,
      scheduled: false,
      account_id: accountState.id
    })
    .then(resp => {
      reRenderList()
      document.getElementsByClassName('form__name')[0].focus()
      document.getElementsByClassName('form__name')[0].value = ''
      document.getElementsByClassName('form__priority')[0].value = ''
      document.getElementsByClassName('form__description')[0].value = ""
    })
    .catch(resp => console.log(resp))
  }

  if(displayForm == true){
    return(
      <form className='form' onSubmit={ submitForm } onBlur={ hideForm }>
        <input className='form__name' placeholder='task_name'></input>
        <input className='form__priority' placeholder='task_priority'></input>
        <textarea className='form__description' placeholder='task_description'></textarea>
        <button>Add New Task</button>
      </form>
    )
  }
  else{
    return(
      <div id="unscheduled" onClick={ showForm }>Click to add task</div>
    )
  }
}

export { AppendToDoListForm }