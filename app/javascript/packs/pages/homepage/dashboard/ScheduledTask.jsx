import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

const ScheduledTask = ({ task_id, view, reRenderPage, reRenderDate }) => {
  const [id, setId] = useState()
  const [tag, setTag] = useState()
  const [name, setName] = useState()
  const [displayTime, setDisplayTime] = useState("loading")
  const [time, setTime] = useState()
  const [displayPriority, setDisplayPriority] = useState("-")
  const [priority, setPriority] = useState("-")
  const [description, setDescription] = useState()

  useEffect(() => {
    if (sessionStorage.getItem(`task${task_id}`) == null) {
      fetchTask()
    }
    else{
      let task = JSON.parse(sessionStorage.getItem(`task${task_id}`))
      setId(task.calender_id)
      setName(task.task_name)
      setTime(task.time)
      setPriority(task.task_priority)
      setDescription(task.task_description)
      setTag(task.tag)
    }
  }, [])

  function updateTimeDisplay(e) {
    setDisplayTime(e.target.value)
  }

  useEffect(() => {
    if (time != null) {
     setDisplayTime(time.slice(11, 19))
    }
  }, [time])

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
        reRenderDate()
      }
      else {
        setId(resp.data.data.attributes.calender_id)
        setName(resp.data.data.attributes.task_name)
        setTime(resp.data.data.attributes.time)
        setPriority(resp.data.data.attributes.task_priority)
        setDescription(resp.data.data.attributes.task_description)
        setTag(resp.data.data.attributes.tag)
        sessionStorage.setItem(`task${task_id}`, JSON.stringify(resp.data.data.attributes))
      }
    })
    .catch(resp => console.log(resp))
  }

  //The style state is to update component position
  //when the component is being dragged
  const [style, setStyle] = useState({
    position: "relative",
    zIndex: 0,
    left: 0,
    top: 0
  });

  //When user blurs away from description box update the
  // database.
  function updateDescription(event) {
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

  function updateTime(event) {
    const checkTimeSyntax = parseInt(event.target.value)
    let errorMessage = ""
    if (isNaN(checkTimeSyntax) || event.target.value.length != 4) {
      errorMessage = errorMessage + "Time setting must be 4 int referencing 24 hour time"
    }
    else if (time != null && event.target.value == `${time.slice(11, 13)}${time.slice(14, 16)}`) {
      errorMessage = errorMessage + "The time input is the same as the current value"
    }
    if (errorMessage == "") {
      axios.post('/api/task/' + task_id + '/set_time', {
        time: event.target.value
      })
      .then(resp => {
        fetchTask()
      })
      .catch(resp => console.log(resp))
    }
    else {
      if (event.target.value != "add time" && !isNaN(checkTimeSyntax) && (event.target.value != time.slice(11,19))) {
        alert(errorMessage)
        fetchTask()
      }
    }
    
  }

  function updateName(event) {
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
      reRenderDate()
      sessionStorage.removeItem(`task${task_id}`)
    })
    .catch(resp => console.log(resp))
  }

  function moveFunction(event) {
      // (1) prepare to moving: make absolute and on top by z-index
      setStyle({position: 'absolute', zIndex:1000, top:0, left:0});      
      
      // move it out of any current parents directly into body
      // to make it positioned relative to the body
      document.body.append(this);

      // centers the ball at (pageX, pageY) coordinates
      function moveAt(pageX, pageY) {
        let offSetY = document.getElementsByClassName("dashboard-container")[0].offsetTop
        let offSetX = document.getElementsByClassName("dashboard-container")[0].offsetLeft
        setStyle({ position: 'absolute', zIndex:1000, top: (pageY - offSetY - 25 + 'px'),
         left: (pageX - offSetX - 25 + 'px') });
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      function setTaskCalender(target_id) {
        if (target_id != "" && id != target_id) {
          axios.post('/api/task/' + task_id + '/reschedule_task', {
            calender_id: target_id
          })
          .then(resp => {
            reRenderPage()
            fetchTask()
          })
          .catch(resp => console.log(resp))
        }
      }

      // (3) drop the ball, remove unneeded handlers
      function onmouseup(event) {
        let pageY = event.pageY
        let pageX = event.pageX
        document.removeEventListener('mousemove', onMouseMove);
        setTaskCalender(event.target.id)
        setStyle({position: 'relative'});
        document.removeEventListener('mouseup', onmouseup);
      };

      // move our absolutely positioned ball under the pointer
      moveAt(event.pageX, event.pageY);

      // (2) move the ball on mousemove
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onmouseup);

      ondragstart = function() {
      return false;
      };
    }; 

    return(
      <div id={id} className='scheduledTask' style={style}>
        {time != null &&
          <input type='text' id={id} className='task--time' onBlur={updateTime} onChange={updateTimeDisplay} value={displayTime}></input>}
        {time == null && 
          <input type='text' id={id} className='task--time' onBlur={updateTime} defaultValue="add time"></input>}
        {tag != null &&
          <p style={{position: "absolute", width: "15%", left: "15%"}}>{`${tag}- `}</p>}
        {tag != null &&
          <input style={{width: "70%", left: "30%"}} type='text' id={id} className='task--name' onMouseDown={moveFunction} onBlur={updateName} defaultValue={name}></input>}
        {(tag == null) &&  
          <input type='text' id={id} className='task--name' onMouseDown={moveFunction} onBlur={updateName} defaultValue={name}></input>}
        <input type='text' id={id} className='task--priority' onBlur={updatePriority} onChange={updatePriorityDisplay} value={displayPriority}></input>
        <textarea id={id} className='task--description' defaultValue={description} onBlur={updateDescription}></textarea>
        <button id={id} className='task--deleteButton' onClick={deleteTask}>X</button>
      </div>
    )
  }

  export { ScheduledTask }