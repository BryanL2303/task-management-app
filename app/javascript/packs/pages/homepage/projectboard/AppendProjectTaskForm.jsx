import React, { useState,useEffect, useContext } from 'react'
import axios from 'axios'
import { AccountStateContext } from '../context/AccountStateContext'
import { UnscheduledTasksList } from '../context/UnscheduledTasksList'

const AppendProjectTaskForm = ({ project_id, project_name, fetchTasks }) => {
	const [displayForm, setDisplayForm] = useState(false)
	const [accountState, setAccountState] = useContext(AccountStateContext)
	const [unscheduledTasks, setUnscheduledTasks] = useContext(UnscheduledTasksList)

	function showForm(e) {
		setDisplayForm(true)
	}

	function hideForm(e) {
		if ((e.relatedTarget == null || !("form" in e.relatedTarget)) 
			&& e.target.innerHTML != "Add New Task") {
		  setDisplayForm(false)  
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

	function postCreateTask(form){
		axios.post('/api/task/1/create_task', {
	    task_name: form[0].value,
	    task_priority: form[1].value,
	    task_description: form[2].value,
	    scheduled: false,
	    project_id: project_id,
	    account_id: accountState.id,
	    tag: JSON.parse(sessionStorage.getItem(`project${project_id}`)).attributes.tag
	  })
	  .then(resp => {
	    fetchUnscheduledTasks()
	    fetchTasks()
	    document.getElementsByClassName('form__name')[0].focus()
	    document.getElementsByClassName('form__name')[0].value = ''
	    document.getElementsByClassName('form__priority')[0].value = ''
	    document.getElementsByClassName('form__description')[0].value = ""
	  })
	  .catch(resp => console.log(resp))
	}

	function fetchUnscheduledTasks() {
	    axios.get('/api/account/' + accountState.id + '/get_unscheduled_tasks')
	    .then(resp => {
	      if (resp.data.data != null) {
	        sessionStorage.setItem("unscheduledTasks", JSON.stringify(resp.data.data))
	        setUnscheduledTasks(resp.data.data)
	      }
	    })
	    .catch(resp => console.log(resp))
  	}

	if (displayForm == true) {
	  return(
	    <form className='form' onSubmit={ submitForm } onBlur= { hideForm }>
		    <input className='form__name' placeholder='task_name'></input>
		    <input className='form__priority' placeholder='task_priority'></input>
		    <textarea className='form__description' placeholder='task_description'></textarea>
		    <button>Add New Task</button>
		  </form>
	  )
	}
	else {
	  return(
	    <div onClick={ showForm }>Click to add task</div>
	  )
	}
}

export { AppendProjectTaskForm }