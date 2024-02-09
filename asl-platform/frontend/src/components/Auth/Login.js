import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/style.scss';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {FormattedMessage} from 'react-intl'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get('token')) {
      navigate('/home');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
        keepLoggedIn,
      });

      if (keepLoggedIn) {
        const expiration = new Date().getTime() + 24 * 60 * 60 * 1000;
        Cookies.set('token', response.data.token, { expires: new Date(expiration) });
      } else {
        Cookies.set('token', response.data.token);
      }

      navigate('/home');
    } catch (error) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className='form-container auth'>
      <div className='main-container'>
        <div className='main-logo'></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
          />
        </div>
        <div>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />
        </div>
        <label className='checkbox'>
          <input
            type='checkbox'
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
          />
          <FormattedMessage id="keep-me"/>
        </label>
        <div className='link-container'>
        <FormattedMessage id="dont-have-acc"/> <Link to='/register' className='link'>
          <FormattedMessage id="sidebar7"/>
          </Link>
        </div>
        {error && <p className='error'>{error}</p>}
        <button type='submit'><FormattedMessage id="sidebar8"/></button>
      </form>
    </div>
  );
};

export default Login;
