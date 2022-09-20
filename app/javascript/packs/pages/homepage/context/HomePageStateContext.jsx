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
		//Only for mobile view, hide sidebar once button is pressed
		if (screen.width <= 500) {
			let sideBar = document.getElementsByClassName('sidebar-container')[0]
		    let board
		    if (sessionStorage.getItem('homePageState') == 'dashboard') {
		    	board = document.getElementsByClassName('dashboard-container')[0]
		    }
		    else if (sessionStorage.getItem('homePageState') == 'project') {
		    	board = document.getElementsByClassName('project__container')[0]
		    }
		    if (sideBar.style['visibility'] != 'hidden') {
			    sideBar.style['visibility'] = 'hidden'   
			    board.style['width'] = '100%'
			    board.style['left'] = '0%'
			    board.style['visibility'] = 'visible'
		    }
		}
	}, [homePageState])

	return(
		<HomePageStateContext.Provider value={[homePageState, setHomePageState]}>
			{props.children}
		</HomePageStateContext.Provider>
	)
}