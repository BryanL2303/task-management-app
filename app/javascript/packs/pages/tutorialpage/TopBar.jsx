import React, { useState, useEffect, useContext } from 'react'

const TopBar = ({stage, setStage}) => {
  const [prevTutorialText, setPrevTutorialText] = useState()
  const [nextTutorialText, setNextTutorialText] = useState("Dashboard")

  useEffect(() => {
    if (stage == 1) {
      setPrevTutorialText()
      setNextTutorialText("Tutorial 2")
    }
    else if (stage == 2) {
      setPrevTutorialText("Tutorial 1")
      setNextTutorialText("Tutorial 3")
    }
    else if (stage == 3) {
      setPrevTutorialText("Tutorial 2")
      setNextTutorialText()
    }
  }, [stage])

  function previousTutorial(e) {
    if (stage != 1) {
      setStage(stage - 1)      
    }
  }

  function nextTutorial(e) {
    if (stage != 3) {
      setStage(stage + 1)
    }
    else {
      alert("This is the end of the tutorial, please head back to the dashboard!")
    }
  }

  function showDashboard () {
    window.location.href = '/home'
  }

  return(
    <nav className='topbar-container'>
      <button onClick={previousTutorial}>{prevTutorialText}</button>
      <button onClick={nextTutorial}>{nextTutorialText}</button>
      <button onClick={showDashboard}>Back to Dashboard</button>
    </nav>
  )
}

export { TopBar }