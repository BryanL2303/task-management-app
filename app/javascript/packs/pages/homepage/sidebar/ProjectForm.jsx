import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'

const ProjectForm = ({ fetchProjects }) => {
  const [displayForm, setDisplayForm] = useState(false)
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

  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/project/1/create_project', {
      project_name: e.target[0].value,
      project_description: e.target[1].value,
      account_id: accountState.id,
      tag: name.slice(0, 10)
    })
    .then(resp => {
      fetchProjects()
      document.getElementsByClassName('form__name')[0].focus()
      document.getElementsByClassName('form__name')[0].value = ''
      document.getElementsByClassName('form__description')[0].value = ""
    })
    .catch(resp => console.log(resp))
  }

  if (displayForm == true) {
    return(
      <form className='form' onSubmit={ submitForm } onBlur={ hideForm }>
        <input className='form__name' placeholder='project_name'></input>
        <textarea className='form__description' placeholder='project_description'></textarea>
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