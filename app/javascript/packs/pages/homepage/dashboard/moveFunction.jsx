import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'

export default function moveFunction(e) {
  let task = document.getElementsByClassName('scheduled-task')[0]
  task.style['position'] = 'absolute'
  task.style['zIndex'] = '1000'
      
  // move it out of any current parents directly into body
  // to make it positioned relative to the body
  //document.body.append(this);

  // centers the ball at (pageX, pageY) coordinates
  function moveAt(pageX, pageY) {
    let offSetY = document.getElementsByClassName("dashboard-container")[0].offsetTop
    let offSetX = document.getElementsByClassName("dashboard-container")[0].offsetLeft
    task.style['top'] = (pageY - offSetY - 25 + 'px')
    task.style['left'] = (pageX - offSetX - 25 + 'px')
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
    task.style['position'] = 'relative'
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