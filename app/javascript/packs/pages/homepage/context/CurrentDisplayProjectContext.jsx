import React, { createContext, useState, useEffect } from 'react'

export const CurrentDisplayProjectContext = createContext([[], function(){}])

export const CurrentDisplayProjectProvider = props => {
	let stateOnRender
	if (sessionStorage.getItem('homePageState') == 'project') {
		stateOnRender = JSON.parse(sessionStorage.getItem('currentDisplayProjectState'))
	}
	const [currentDisplayProjectState, setCurrentDisplayProjectState] = useState(stateOnRender)

	useEffect(() => {
		sessionStorage.setItem('currentDisplayProjectState', JSON.stringify(currentDisplayProjectState))
	}, [currentDisplayProjectState])

	return(
		<CurrentDisplayProjectContext.Provider value={[currentDisplayProjectState, setCurrentDisplayProjectState]}>
			{props.children}
		</CurrentDisplayProjectContext.Provider>
	)
}