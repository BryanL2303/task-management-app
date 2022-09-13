import React, { createContext, useState } from 'react'

export const ProjectListContext = createContext([[], function(){}])

export const ProjectListProvider = props => {
	let stateOnRender = []
	if (sessionStorage.getItem('projectList') != null &&
		sessionStorage.getItem('projectList') != 'undefined') {
		stateOnRender = JSON.parse(sessionStorage.getItem('projectList'))
	}
	const [projects, setProjects] = useState(stateOnRender)

	return(
		<ProjectListContext.Provider value={[projects, setProjects]}>
			{props.children}
		</ProjectListContext.Provider>
	)
}