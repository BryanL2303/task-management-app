import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

const LogInPage = () => {
  const [name, setName] = useState()
  const [password, setPassword] = useState()

  function changeName(e) {
    setName(e.target.value)
  }

  function changePassword(e) {
    setPassword(e.target.value)
  }

  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/account/0/checkNameExistence', {
      name: name,
    })
    .then(resp => {
      console.log(resp)
      if (resp.data == true) {
        authenticateAccount()
      }
      else {
        alert("Username does not exist, please double check input.")
      }
    })
    .catch(resp => console.log(resp))    
  }

  function authenticateAccount(){
    axios.post('/api/account/0/authenticateAccount', {
      name: name,
      password: password,
    })
    .then(resp => {
      if (resp.data != false) {
        sessionStorage.setItem('id', resp.data.id)
        sessionStorage.setItem('name', resp.data.name)
        window.location.href = '/home'
      }
      else {
        alert("Password is wrong, please try again.")
      }
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div className='log-in-page'>
      <form className='log-in-form' onSubmit={ submitForm }>
        <input className='log-in-form__name' placeholder='username' onChange={ changeName }></input>
        <input className='log-in-form__password' placeholder='password' onChange={ changePassword }></input>
        <button>Log In</button>
      </form>
      <a href='/create_account'>Don't have an account? Click here to create account</a>
    </div>
  )
}

export { LogInPage }