import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { TaskList } from './projectboard/TaskList'
import { AccountStateContext } from './context/AccountStateContext'
import { ProjectListContext } from './context/ProjectListContext'

const Projectboard = ({project, showDashboard, reRenderProject}) => {
  const [description, setDescription] = useState(project.attributes.project_description)
  const [project_id, setProject_Id] = useState(project.id)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [projects, setProjects] = useContext(ProjectListContext)
  
	useEffect(()=> {
		let projectSettings = document.getElementsByClassName('project__settings')[0]
    projectSettings.style['visibility'] = 'hidden'
		setDescription(project.attributes.project_description)
		document.getElementsByClassName('project__description')[0].value = project.attributes.project_description
		document.getElementsByClassName('project__tag')[0].value = project.attributes.tag
		setProject_Id(project.id)
	}, [project])

	function saveDescription(e) {
		if (description != e.target.value) {
			axios.post('/api/project/' + project.id + '/update_project', {
		    project_description: String(e.target.value)
		  })
		  .then(resp => {
		  	reRenderProject(project.id)
		  })
		 	.catch(resp => console.log(resp))
		}
	}

	function deleteProject() {
		if (confirm("This will delete the project and all tasks associated with it!")) {
			console.log("Delete")
			showDashboard()
			axios.delete('/api/project/' + project_id)
		  .then(resp => {
		  	sessionStorage.removeItem(`project${project_id}`)
		  	showDashboard()
		  	fetchProjects()
		  })
		  .catch(resp => console.log(resp))
		}
	}

	function fetchProjects() {
    axios.get('/api/account/' + accountState.id + '/projects')
    .then(resp => {
    	sessionStorage.setItem('projectList', JSON.stringify(resp.data.data))
      setProjects(resp.data.data)
    })
    .catch(resp => console.log(resp))
  }

  function updateTag(e) {
    if (project.attributes.tag != e.target.value) {
    	if (e.target.value.length > 10) {
    		alert("The tag should be within 10 characters")
    	}
    	else{
	      axios.post('/api/project/' + project_id + '/update_project', {
	        tag: String(e.target.value)
	      })
	      .then(resp => {
	        project.relationships.tasks.data.map(task => {
	        	sessionStorage.removeItem(`task${task.id}`)
	        })
	        reRenderProject(project.id)
	      })
	      .catch(resp => console.log(resp))    		
    	}
    }
  }

  function showProjectSettings(e) {
    let projectSettings = document.getElementsByClassName('project__settings')[0]
    if (projectSettings.style['visibility'] == 'hidden') {
      projectSettings.style['visibility'] = 'visible'
    }
    else {
      projectSettings.style['visibility'] = 'hidden'
    }
  }

  function toggleProjectTaskList() {
    let projectDescription = document.getElementsByClassName('project__description')[0]
    let projectTaskList = document.getElementsByClassName('project__task-container')[0]
    if (projectTaskList.style['visibility'] != 'hidden') {
      projectDescription.style['width'] = '100%'
      projectTaskList.style['visibility'] = 'hidden'
    }
    else {
      projectDescription.style['width'] = '50%'
      projectTaskList.style['visibility'] = 'visible'
    }
  }

	return(
		<div className="project__container">
			<div className="project__header">
				<h1>{project.attributes.project_name}</h1>
				<label>Tag (This will prefix all task names): </label>
				<input type='text' className='project__tag' onBlur={updateTag} defaultValue={ project.attributes.tag }></input>
				<button className='project__show-settings--button' onClick={showProjectSettings}><img src="/packs/media/packs/pages/homepage/projectboard/project-settings-icon-888be188c27c65a4af51589ffef5291d.jpg"/></button>
				<div className='project__settings'>
					<button onClick={toggleProjectTaskList}>Task List</button>
					<button className="project__delete--button" onClick={ deleteProject }>Delete Project</button>
				</div>
			</div>

			<textarea className="project__description" onBlur={ saveDescription } defaultValue={ description }></textarea>
			
			<TaskList project_id={ project_id } project_name={project.attributes.project_name}/>
		</div>
	)
}

export { Projectboard }