import React, { useState, useEffect, useContext } from 'react'
import { TopBar } from './tutorialpage/TopBar'
import TutorialNavBars from './tutorialpage/tutorialNavBars.jpg'
import TutorialDashboard from './tutorialpage/tutorialDashboard.jpg'
import TutorialProjectboard from './tutorialpage/tutorialProjectboard.jpg'

const TutorialPage = () => {
  const [stage, setStage] = useState(1)

  useEffect(() => {
    //Do stuff
  }, [])

  return(
    <div className="tutorial-page">
      <TopBar stage={stage} setStage={setStage}/>
      {stage == 1 && <img src={TutorialNavBars}/>}
      {stage == 2 && <img src={TutorialDashboard}/>}
      {stage == 3 && <img src={TutorialProjectboard}/>}
    </div>
  )
}

export { TutorialPage }