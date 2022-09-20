import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

const ProjectTask = ({ task_id, view, reRenderList }) => {
  const [name, setName] = useState()
  const [priority, setPriority] = useState()
  const [description, setDescription] = useState()

  useEffect(() => {
    if (sessionStorage.getItem(`task${task_id}`) == null) {
      fetchTask()
    }
    else{
      let task = JSON.parse(sessionStorage.getItem(`task${task_id}`))
      setName(task.task_name)
      setPriority(task.task_priority)
      setDescription(task.task_description)
    }
  }, [])

  function fetchTask() {
    axios.get('/api/task/' + task_id)
    .then( resp => {
      if (resp.data.data == null) {
        reRenderList()
      }
      else {
        setName(resp.data.data.attributes.task_name)
        setPriority(resp.data.data.attributes.task_priority)
        setDescription(resp.data.data.attributes.task_description)
        sessionStorage.setItem(`task${task_id}`, JSON.stringify(resp.data.data.attributes))
      }
    })
    .catch(resp => console.log(resp))
  }

  //When user blurs away from description box update the
  // database.
  function changeDescription(e) {
    if (description != e.target.value) {
      axios.post('/api/task/' + task_id + '/update_task', {
        task_description: String(e.target.value)
      })
      .then(resp => {
        fetchTask()
      })
      .catch(resp => console.log(resp))
    }
  }

  function changeName(e) {
    if (name != e.target.value) {
      axios.post('/api/task/' + task_id + '/update_task', {
        task_name: e.target.value
      })
      .then(resp => {
        fetchTask()
      })
      .catch(resp => console.log(resp))
    }
  }

  function updatePriority(e) {
    const checkPrioritySyntax = parseInt(e.target.value)
    let errorMessage = ""
    if (isNaN(checkPrioritySyntax)
     || 0 > checkPrioritySyntax || checkPrioritySyntax > 3) {
      errorMessage = errorMessage + "Priority setting must be int between 0 - 3,\n"
    }
    if (errorMessage == "") {
      if (priority != e.target.value) {
        axios.post('/api/task/' + task_id + '/update_task', {
          task_priority: e.target.value
        })
        .then(resp => {
          fetchTask()
        })
        .catch(resp => console.log(resp))
      }
    }
    else {
      alert(errorMessage)
    }
  }

  function deleteTask(e) {
    axios.delete('/api/task/' + task_id)
    .then(resp => {
      sessionStorage.removeItem(`task${task_id}`)
      reRenderList()
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div className='project-task'>
      <input type='text' className='task__name' onBlur={changeName} defaultValue={name}></input>
      <input type='text' className='task__priority' onBlur={updatePriority} defaultValue={priority}></input>
      <textarea className='task__description' onBlur={changeDescription} defaultValue={description}></textarea>
      <button className='task__delete--button' onClick={deleteTask}>X</button>
    </div>
  )
}

export { ProjectTask }