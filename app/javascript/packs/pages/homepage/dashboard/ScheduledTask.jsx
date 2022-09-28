import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

const ScheduledTask = ({ task_id, view, reRenderPage, reRenderDate }) => {
  const [id, setId] = useState()
  const [tag, setTag] = useState()
  const [name, setName] = useState()
  const [time, setTime] = useState()
  const [priority, setPriority] = useState()
  const [description, setDescription] = useState()
  const [onCalender, setOnCalender] = useState()
  //Time display is required since there is a conversion from
  //Ruby time object to time string
  const [displayTime, setDisplayTime] = useState("loading")

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
      setOnCalender(task.on_calender)
    }
  }, [])

  function updateTimeDisplay(e) {
    setDisplayTime(e.target.value)
  }

  useEffect(() => {
    let descriptionBox = document.getElementsByClassName(`task__description ${task_id}`)[0]
    descriptionBox.style['height'] = '0px'
    descriptionBox.style['height'] = `${descriptionBox.scrollHeight}px`
  }, [description])

  useEffect(() => {
    if (time != null) {
     setDisplayTime(time.slice(11, 19))
    }
  }, [time])

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
        setOnCalender(resp.data.data.attributes.on_calender)
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

  function moveFunction(e) {
    // (1) prepare to moving: make absolute and on top by z-index
    setStyle({position: 'absolute', zIndex:1000, top:0, left:0});      

    // centers the ball at (pageX, pageY) coordinates
    function moveAt(pageX, pageY) {
      let offSetY = document.getElementsByClassName("dashboard-container")[0].offsetTop
      let offSetX = document.getElementsByClassName("dashboard-container")[0].offsetLeft
      setStyle({ position: 'absolute', zIndex:1000, top: (pageY - offSetY + 20 + 'px'),
        left: (pageX - offSetX + 20 + 'px') });
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
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
    function onmouseup(e) {
      let pageY = e.pageY
      let pageX = e.pageX
      document.removeEventListener('mousemove', onMouseMove);
      setTaskCalender(e.target.id)
      setStyle({position: 'relative'});
      document.removeEventListener('mouseup', onmouseup);
    };

    // move our absolutely positioned ball under the pointer
    moveAt(e.pageX, e.pageY);

    // (2) move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onmouseup);

    ondragstart = function() {
    return false;
    };
  };

  //When user blurs away from description box update the
  // database.
  function updateDescription(e) {
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

  function updateTime(e) {
    const checkTimeSyntax = parseInt(e.target.value)
    console.log(checkTimeSyntax)
    let errorMessage = ""
    if (isNaN(checkTimeSyntax) || e.target.value.length != 4) {
      errorMessage = errorMessage + "Time setting must be 4 int referencing 24 hour time"
    }
    else if (time != null && e.target.value == `${time.slice(11, 13)}${time.slice(14, 16)}`) {
      errorMessage = errorMessage + "The time input is the same as the current value"
    }
    if (errorMessage == "") {
      axios.post('/api/task/' + task_id + '/update_task', {
        time: e.target.value
      })
      .then(resp => {
        fetchTask()
      })
      .catch(resp => console.log(resp))
    }
    else {
      if (time == null) {
        if (e.target.value != "add time")
          alert(errorMessage)
          fetchTask()
        }
      else {
        if (!isNaN(checkTimeSyntax) && (e.target.value != time.slice(11,19))) {
          alert(errorMessage)
          fetchTask() 
        }
      }
    }
    
  }

  function updateName(e) {
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
      reRenderDate()
      sessionStorage.removeItem(`task${task_id}`)
    })
    .catch(resp => console.log(resp))
  }

  function toggleCalender(e) {
    axios.post('/api/task/' + task_id + '/update_task', {
      on_calender: e.target.checked
    })
    .then(resp => {
      fetchTask()
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div id={id} className='scheduled-task' style={style}>
      <div className='task__label'>
        <img src='/packs/media/packs/pages/homepage/task-dragging-icon-400fd3434b093156826257c2d2ad4a2c.jpg' className='task__move--img' onMouseDown={moveFunction}/>
        {time != null &&
          <input type='text' id={id} className='task__time' onBlur={updateTime} onChange={updateTimeDisplay} value={displayTime}></input>}
        {time == null && 
          <input type='text' id={id} className='task__time' onBlur={updateTime} defaultValue="add time"></input>}
        {tag != null &&
          <label id={id} className='task__tag'>{tag}-</label>}
        <input type='text' id={id} className='task__name' onBlur={updateName} defaultValue={name}></input>
        {(onCalender == false || onCalender == null) &&
          <input type='checkbox' id={id} name="calender" className='task__on-calender' onClick={toggleCalender}></input>}
        {onCalender == true &&
          <input type='checkbox' defaultChecked id={id} name="calender" className='task__on-calender' onClick={toggleCalender}></input>}
        <label htmlFor='calender' className='task__on-calender--label'><img src="/packs/media/packs/pages/homepage/calender-icon-f42e69b4071f9476f2d436c3045374f2.jpg"/></label>
        <input type='text' id={id} className='task__priority' onBlur={updatePriority} defaultValue={priority}></input>
        <button id={id} className='task__delete--button' onClick={deleteTask}>X</button>
      </div>
      <textarea id={id} className={`task__description ${task_id}`} onBlur={updateDescription} defaultValue={description}></textarea>
    </div>
  )
}

  export { ScheduledTask }