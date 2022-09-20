import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

const AccountCreationPage = () => {
  //If there is an ongoing session go to home page
  if (sessionStorage.getItem('id') != null) {
    window.location.href = '/home'
  }

  function submitForm(e) {
    e.preventDefault()
    axios.post('/api/account/0/create_account', {
      name: e.target[0].value,
      password: e.target[1].value,
    })
    .then(resp => {
      if (resp.data != false) {
        sessionStorage.setItem('id', resp.data.id)
        sessionStorage.setItem('name', resp.data.name)
        window.location.href = '/home'        
      }
      else{
        alert("Username has been taken, please try another name.")
      }
    })
    .catch(resp => console.log(resp))    
  }

  return(
    <div className='create-account-page'>
      <form className='create-account-form' onSubmit={ submitForm }>
        <input className='create-account-form__name' placeholder='username'></input>
        <input className='create-account-form__password' placeholder='password'></input>
        <button>Create Account</button>
      </form>
      <a href='/'>Already have an account? Click here to log in</a>
    </div>
  )
}

export { AccountCreationPage }