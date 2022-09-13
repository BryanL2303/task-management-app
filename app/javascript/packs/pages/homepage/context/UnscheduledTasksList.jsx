import React, { createContext, useState } from 'react'

export const UnscheduledTasksList = createContext([[], function(){}])

export const UnscheduledTasksProvider = props => {
	let stateOnRender = []
	if (sessionStorage.getItem('unscheduledTasks') != null &&
		sessionStorage.getItem('unscheduledTasks') != 'undefined') {
		stateOnRender = JSON.parse(sessionStorage.getItem('unscheduledTasks'))
	}
	const [unscheduledTasks, setUnscheduledTasks] = useState(stateOnRender)

	return(
		<UnscheduledTasksList.Provider value={[unscheduledTasks, setUnscheduledTasks]}>
			{props.children}
		</UnscheduledTasksList.Provider>
	)
}