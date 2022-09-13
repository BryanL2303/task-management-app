import React, { createContext, useState } from 'react'

export const ProjectboardStyleContext = createContext([[], function(){}])

export const ProjectboardStyleProvider = props => {
	const [projectboardStyle, setProjectboardStyle] = useState()

	return(
		<ProjectboardStyleContext.Provider value={[projectboardStyle, setProjectboardStyle]}>
			{props.children}
		</ProjectboardStyleContext.Provider>
	)
}