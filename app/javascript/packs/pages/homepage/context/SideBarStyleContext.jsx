import React, { createContext, useState } from 'react'

export const SideBarStyleContext = createContext([[], function(){}])

export const SideBarStyleProvider = props => {
	const [sideBarStyle, setSideBarStyle] = useState()

	return(
		<SideBarStyleContext.Provider value={[sideBarStyle, setSideBarStyle]}>
			{props.children}
		</SideBarStyleContext.Provider>
	)
}