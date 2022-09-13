import React, { createContext, useState } from 'react'

export const DashboardStyleContext = createContext([[], function(){}])

export const DashboardStyleProvider = props => {
	const [dashboardStyle, setDashboardStyle] = useState()

	return(
		<DashboardStyleContext.Provider value={[dashboardStyle, setDashboardStyle]}>
			{props.children}
		</DashboardStyleContext.Provider>
	)
}