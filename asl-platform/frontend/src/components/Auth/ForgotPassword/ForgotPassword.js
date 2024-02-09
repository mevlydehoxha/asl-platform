import React, { useState } from 'react';
import axios from 'axios';
import './styles/ForgotPassword.scss'
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/forgotpassword', { email })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error)
        setMessage(error.response.data.message);
      });
  };

  const goBack = () =>{
    navigate('/home')
  }

  return (
    <div className='forgot-password'>
      <button className='go-back' onClick={goBack}>Go back</button>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <button type="submit">Reset Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ForgotPassword;
