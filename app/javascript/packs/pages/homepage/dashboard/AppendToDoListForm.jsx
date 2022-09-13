import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const AppendToDoListForm = ({ reRenderList }) => {
  const [displayForm, setDisplayForm] = useState(false)
  const [name, setName] = useState()
  const [priority, setPriority] = useState()
  const [description, setDescription] = useState("")
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

  function changeName(e) {
    setName(e.target.value)
  }

  function changePriority(e) {
    setPriority(e.target.value)
  }

  function changeDescription(e) {
    setDescription(e.target.value)
  }

  function submitForm(e) {
    e.preventDefault()
    const checkPrioritySyntax = parseInt(priority)
    if ((!isNaN(checkPrioritySyntax)) 
      && ((0) <= checkPrioritySyntax && checkPrioritySyntax <= 3)) {
      postCreateTask()
    }
    else {
      alert("Priority setting must be int between 0 - 3")
    }
  }

  function postCreateTask() {
    axios.post('/api/task/1/create_task', {
      task_name: name,
      task_priority: priority,
      task_description: description,
      scheduled: false,
      account_id: accountState.id
    })
    .then(resp => {
      reRenderList()
      document.getElementsByClassName('form--name')[0].focus()
      document.getElementsByClassName('form--name')[0].value = ''
      document.getElementsByClassName('form--priority')[0].value = ''
      document.getElementsByClassName('form--description')[0].value = ""
      setName()
      setPriority()
      setDescription("")
    })
    .catch(resp => console.log(resp))
  }

  if(displayForm == true){
    return(
      <form className='form' onSubmit={ submitForm } onBlur={ hideForm }>
        <input className='form--name' placeholder='task_name' onChange={ changeName }></input>
        <input className='form--priority' placeholder='task_priority' onChange={ changePriority }></input>
        <textarea className='form--description' placeholder='task_description' onChange={ changeDescription }></textarea>
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