import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'

const AccountCreationPage = () => {
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
      if (resp.data == false) {
        createAccount()
      }
      else {
        alert("Username has been taken, please try another name.")
      }
    })
    .catch(resp => console.log(resp))    
  }

  function createAccount(){
    axios.post('/api/account/0/createAccount', {
      name: name,
      password: password,
    })
    .then(resp => {
      sessionStorage.setItem('id', resp.data.id)
      sessionStorage.setItem('name', resp.data.name)
      window.location.href = '/home'
    })
    .catch(resp => console.log(resp))
  }

  return(
    <div className='create-account-page'>
      <form className='create-account-form' onSubmit={ submitForm }>
        <input className='create-account-form__name' placeholder='username' onChange={ changeName }></input>
        <input className='create-account-form__password' placeholder='password' onChange={ changePassword }></input>
        <button>Create Account</button>
      </form>
      <a href='/'>Already have an account? Click here to log in</a>
    </div>
  )
}

export { AccountCreationPage }