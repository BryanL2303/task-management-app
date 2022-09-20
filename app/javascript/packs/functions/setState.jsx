import React from 'react'

export default function setState(event, setStateFunction) {
	setStateFunction(event.target.value)
}