import React, { createContext, useState, useEffect } from 'react'

export const HomePageStateContext = createContext([[], function(){}])

export const HomePageStateProvider = props => {
	let stateOnRender
	if (sessionStorage.getItem('homePageState') == null) {
		stateOnRender = 'dashboard'
	}
	else {
		stateOnRender = sessionStorage.getItem('homePageState')
	}
	const [homePageState, setHomePageState] = useState(stateOnRender)

	useEffect(() => {
		sessionStorage.setItem('homePageState', homePageState)
	}, [homePageState])

	return(
		<HomePageStateContext.Provider value={[homePageState, setHomePageState]}>
			{props.children}
		</HomePageStateContext.Provider>
	)
}