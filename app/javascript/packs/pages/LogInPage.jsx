import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

const LogInPage = () => {
  //If there is an ongoing session go to home page
  if (sessionStorage.getItem('id') != null) {
    window.location.href = '/home'
  }

  //Handle submit form event
  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/account/0/authenticate_account', {
      name: e.target[0].value,
      password: e.target[1].value,
    })
    .then(resp => {
      if (resp.data != false) {
        sessionStorage.setItem('id', resp.data.id)
        sessionStorage.setItem('name', resp.data.name)
        window.location.href = '/home'
      }
      else {
        alert("Username or password is wrong, please double check input.")
      }
    })
    .catch(resp => console.log(resp))    
  }

  return(
    <div className='log-in-page'>
      <form className='log-in-form' onSubmit={ submitForm }>
        <input className='log-in-form__name' placeholder='username'></input>
        <input className='log-in-form__password' type='password' placeholder='password'></input>
        <button>Log In</button>
      </form>
      <a href='/create_account'>Don't have an account? Click here to create account</a>
    </div>
  )
}

export { LogInPage }