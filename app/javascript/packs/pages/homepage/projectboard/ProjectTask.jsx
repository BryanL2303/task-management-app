import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

const ProjectTask = ({ task_id, view, reRenderList }) => {
  const [name, setName] = useState()
  const [displayPriority, setDisplayPriority] = useState("-")
  const [priority, setPriority] = useState("-")
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

  function updatePriorityDisplay(e) {
    setDisplayPriority(e.target.value)
  }

  useEffect(() => {
    if (priority == null) {
     setDisplayPriority('-')
    }
    else {
      setDisplayPriority(priority)
    }
  }, [priority])

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
  function changeDescription(event) {
    if (description != event.target.value) {
      axios.post('/api/task/' + task_id + '/set_description', {
        task_description: String(event.target.value)
      })
      .then(resp => {
        fetchTask()
      })
      .catch(resp => console.log(resp))
    }
  }

  function changeName(e) {
    if (name != event.target.value) {
      axios.post('/api/task/' + task_id + '/set_name', {
        task_name: event.target.value
      })
      .then(resp => {
        fetchTask()
      })
      .catch(resp => console.log(resp))
    }
  }

  function updatePriority(event) {
    const checkPrioritySyntax = parseInt(event.target.value)
    let errorMessage = ""
    if (isNaN(checkPrioritySyntax)
     || 0 > checkPrioritySyntax || checkPrioritySyntax > 3) {
      errorMessage = errorMessage + "Priority setting must be int between 0 - 3,\n"
    }
    if (errorMessage == "") {
      if (priority != event.target.value) {
        axios.post('/api/task/' + task_id + '/set_priority', {
          task_priority: event.target.value
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

  function deleteTask(event) {
    axios.delete('/api/task/' + task_id)
    .then(resp => {
      reRenderList()
      sessionStorage.removeItem(`task${task_id}`)
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div className='projectTask'>
      <input type='text' className='task--name' onBlur={ changeName } defaultValue={ name }></input>
      <input type='text' className='task--priority' onBlur={updatePriority} onChange={updatePriorityDisplay} value={displayPriority}></input>
      <textarea className='task--description' defaultValue={ description } onBlur={ changeDescription }></textarea>
      <button className='task--deleteButton' onClick={ deleteTask }>X</button>
    </div>
  )
}

export { ProjectTask }