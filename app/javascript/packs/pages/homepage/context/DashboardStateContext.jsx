import React, { createContext, useState } from 'react'

export const DashboardStateContext = createContext([[], function(){}])

export const DashboardStateProvider = props => {
	let stateOnRender = []
	if (sessionStorage.getItem('dashboardState') != null && 
		sessionStorage.getItem('dashboardState') != 'undefined') {
		stateOnRender = JSON.parse(sessionStorage.getItem('dashboardState'))
	}
	const [dashboardState, setDashboardState] = useState(stateOnRender)

	return(
		<DashboardStateContext.Provider value={[dashboardState, setDashboardState]}>
			{props.children}
		</DashboardStateContext.Provider>
	)
}