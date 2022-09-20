import React, { createContext, useState } from 'react'

export const AccountStateContext = createContext([[], function(){}])

export const AccountStateProvider = props => {
	let stateOnRender
	//Check sessionStorage to see if user is logged in
	if (sessionStorage.getItem('id') != null &&
		sessionStorage.getItem('id') != 'undefined') {
		stateOnRender = {
	    	id: sessionStorage.getItem('id'),
    		name: sessionStorage.getItem('name')
    	}
	}
	const [accountState, setAccountState] = useState(stateOnRender)

	return(
		<AccountStateContext.Provider value={[accountState, setAccountState]}>
			{props.children}
		</AccountStateContext.Provider>
	)
}