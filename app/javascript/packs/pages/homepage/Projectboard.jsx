import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { TaskList } from './projectboard/TaskList'
import { AccountStateContext } from './context/AccountStateContext'
import { ProjectListContext } from './context/ProjectListContext'
import { ProjectboardStyleContext } from './context/ProjectboardStyleContext'
import { ProjectDescriptionStyleContext } from './context/ProjectDescriptionStyleContext'

const Projectboard = ({project, showDashboard, reRenderProject}) => {
  const [description, setDescription] = useState(project.attributes.project_description)
  const [project_id, setProject_Id] = useState(project.id)
  const [accountState, setAccountState] = useContext(AccountStateContext)
  const [projects, setProjects] = useContext(ProjectListContext)
  const [projectboardStyle, setProjectboardStyle] = useContext(ProjectboardStyleContext)
  const [projectDescriptionStyle, setProjectDescriptionStyle] = useContext(ProjectDescriptionStyleContext)

	useEffect(()=> {
		setDescription(project.attributes.project_description)
		document.getElementsByClassName('project--descriptionbox')[0].value = project.attributes.project_description
		document.getElementsByClassName('project--tag')[0].value = project.attributes.tag
		setProject_Id(project.id)
	}, [project])

	function saveDescription(e) {
		if (description != e.target.value) {
			axios.post('/api/project/' + project.id + '/set_description', {
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
		  	showDashboard()
		  	fetchProjects()
		  	sessionStorage.removeItem(`project${project_id}`)
		  })
		  .catch(resp => console.log(resp))
		}
	}

	function fetchProjects() {
    axios.get('/api/account/' + accountState.id + '/projects')
    .then(resp => {
      setProjects(resp.data.data)
      sessionStorage.setItem('projectList', JSON.stringify(resp.data.data))
    })
    .catch(resp => console.log(resp))
  }

  function updateTag(e) {
    if (project.attributes.tag != e.target.value) {
    	if (e.target.value.length > 10) {
    		alert("The tag should be within 10 characters")
    	}
    	else{
	      axios.post('/api/project/' + project_id + '/setTag', {
	        tag: String(e.target.value)
	      })
	      .then(resp => {
	        reRenderProject(project.id)
	        project.relationships.tasks.data.map(task => {
	        	sessionStorage.removeItem(`task${task.id}`)
	        })
	      })
	      .catch(resp => console.log(resp))    		
    	}
    }
  }

	return(
		<div className="projectboard--container" style={projectboardStyle}>
			<div className="projectboard--header">
				<h1>{project.attributes.project_name}</h1>
				<label>Tag (This will prefix all task names): </label>
				<input type='text' className='project--tag' onBlur={updateTag} defaultValue={ project.attributes.tag }></input>
				<button className="button--delete_project" onClick={ deleteProject }>Delete Project</button>
			</div>

			<textarea className="project--descriptionbox" style={projectDescriptionStyle} onBlur={ saveDescription } defaultValue={ description }></textarea>
			
			<TaskList project_id={ project_id } project_name={project.attributes.project_name}/>
		</div>
	)
}

export { Projectboard }