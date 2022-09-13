import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const ProjectForm = ({ fetchProjects }) => {
  const [displayForm, setDisplayForm] = useState(false)
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [accountState, setAccountState] = useContext(AccountStateContext)

  function showForm(e) {
    setDisplayForm(true)
  }

  function hideForm(e) {
    if ((e.relatedTarget == null || !("form" in e.relatedTarget)) 
      && e.target.innerHTML != "Add New Project") {
      setDisplayForm(false)  
    }
  }

  function changeName(e) {
    setName(e.target.value)
  }

  function changeDescription(e) {
    setDescription(e.target.value)
  }

  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/project/1/create_project', {
      project_name: name,
      project_description: description,
      account_id: accountState.id,
      tag: name.slice(0, 10)
    })
    .then(resp => {
      fetchProjects()
      document.getElementsByClassName('form--name')[0].focus()
      document.getElementsByClassName('form--name')[0].value = ''
      document.getElementsByClassName('form--description')[0].value = ""
      setName()
      setDescription()
    })
    .catch(resp => console.log(resp))
  }

  if (displayForm == true) {
    return(
      <form className='form' onSubmit={ submitForm } onBlur={ hideForm }>
        <input className='form--name' placeholder='project_name' onChange={ changeName }></input>
        <textarea className='form--description' placeholder='project_description' onChange={ changeDescription }></textarea>
        <button>Add New Project</button>
      </form>
    )
  }
  else {
    return(
      <div onClick={ showForm }>
          Click to add new Project
      </div>
    )
  }
}

export { ProjectForm }