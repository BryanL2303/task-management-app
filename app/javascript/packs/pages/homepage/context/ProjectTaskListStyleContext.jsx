import React, { createContext, useState } from 'react'

export const ProjectTaskListStyleContext = createContext([[], function(){}])

export const ProjectTaskListStyleProvider = props => {
	const [projectTaskListStyle, setProjectTaskListStyle] = useState()

	return(
		<ProjectTaskListStyleContext.Provider value={[projectTaskListStyle, setProjectTaskListStyle]}>
			{props.children}
		</ProjectTaskListStyleContext.Provider>
	)
}