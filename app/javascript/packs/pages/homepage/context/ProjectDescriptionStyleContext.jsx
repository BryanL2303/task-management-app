import React, { createContext, useState } from 'react'

export const ProjectDescriptionStyleContext = createContext([[], function(){}])

export const ProjectDescriptionStyleProvider = props => {
	const [projectDescriptionStyle, setProjectDescriptionStyle] = useState()

	return(
		<ProjectDescriptionStyleContext.Provider value={[projectDescriptionStyle, setProjectDescriptionStyle]}>
			{props.children}
		</ProjectDescriptionStyleContext.Provider>
	)
}