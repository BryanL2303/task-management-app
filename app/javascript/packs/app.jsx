import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LogInPage } from './pages/LogInPage'
import { AccountCreationPage } from './pages/AccountCreationPage'
import { HomePage } from './pages/HomePage'
import { TutorialPage } from './pages/TutorialPage'
import { AccountStateProvider } from './pages/homepage/context/AccountStateContext'
import { HomePageStateProvider } from './pages/homepage/context/HomePageStateContext'
import { CurrentDisplayProjectProvider } from './pages/homepage/context/CurrentDisplayProjectContext'

ReactDOM.render(
  <AccountStateProvider>
  <HomePageStateProvider>
  <CurrentDisplayProjectProvider>
    <Router>
      <Routes>
        <Route path='/' element={<LogInPage/>}/>
        <Route path='/create_account' element={<AccountCreationPage/>}/>      
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/tutorial' element={<TutorialPage/>}/>
      </Routes>
    </Router>
  </CurrentDisplayProjectProvider>
  </HomePageStateProvider>
  </AccountStateProvider>,
  document.body.appendChild(document.createElement('div')),
)