import React, { useState } from 'react';
import axios from 'axios';
import './styles/style.scss';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';


const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!firstname || !lastname || !email || !password) {
      setError('Please fill in required fields.');
      return;
    }
  
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
  
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
  
    if (!lowercaseRegex.test(password) || !uppercaseRegex.test(password) || !digitRegex.test(password)) {
      setError('Password must contain at least one lowercase letter, one uppercase letter, and one digit.');
      return;
    }
  
    axios
      .post('http://localhost:8000/api/users', {
        firstname,
        lastname,
        email,
        password,
      })
      .then((response) => {
        window.location.href = '/login';
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          setError('Email is already taken. Please use a different email.');
        } else {
          setError('An error occurred. Our team has been notified.');
        }
      });
  };
  
  

  return (
    <div className='form-container auth'>
      <div className='main-container'>
          <div className='main-logo'></div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="Firstname"
        />
         <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Lastname"
        />
         <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
         <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className='link-container'> <FormattedMessage id="have-acc"/> <Link to="/login" className='link'><FormattedMessage id="sidebar8"/></Link></div>
        {error ? 
        <p className='error'>{error}</p> 
        : ''}
        <button className='submit' type="submit"><FormattedMessage id="sidebar7"/></button>
      </form>
    </div>
  );
}

export default Register;
