import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ProjectTask } from './ProjectTask'
import { AppendProjectTaskForm } from './AppendProjectTaskForm'
import { AccountStateContext } from '../context/AccountStateContext'
import { ProjectTaskListStyleContext } from '../context/ProjectTaskListStyleContext'

const TaskList = ({ project_id, project_name }) => {
	const [projectTasks, setProjectTasks] = useState([])
	const [accountState, setAccountState] = useContext(AccountStateContext)
	const [projectTaskListStyle, setProjectTaskListStyle] = useContext(ProjectTaskListStyleContext)

	useEffect(() => {
		if (sessionStorage.getItem(`projectTasks${project_id}`) == null) {
      fetchProjectTasks()
    }
    else{
      setProjectTasks(JSON.parse(sessionStorage.getItem(`projectTasks${project_id}`)))
    }
	}, [project_id])

	function fetchProjectTasks() {
		axios.get('/api/account/' + accountState.id + '/get_tasks_by_project/' + project_id)
	  .then(resp => {
	    setProjectTasks(resp.data.data)
	    sessionStorage.setItem(`projectTasks${project_id}`, JSON.stringify(resp.data.data))
	  })
	  .catch(resp => console.log(resp))
	}

	return(
		<div className="project__task-container" style={projectTaskListStyle}>
			{projectTasks.map((task)=> {
		    return(
		      <ProjectTask key={ task.id } task_id={ task.id } reRenderList={ fetchProjectTasks } view="project"/>
		    )
		  })}

			<AppendProjectTaskForm project_id={ project_id } project_name={ project_name } fetchTasks={ fetchProjectTasks }/>
		</div>
	)
}

export { TaskList }