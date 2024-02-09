import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../../shared/SideBar/SideBar.js'
import './Edit.scss'
import Dropdown from '../../shared/Dropdown/Dropdown.js';
import useAuth from '../../Auth/useAuth.js';
import Cookies from 'js-cookie';
import NotFound from '../../shared/NotFound/NotFound.js';
import { FormattedMessage } from 'react-intl';
import SuccessModal from '../../shared/SuccessModal/SuccessModal.js'
import Loading from '../../shared/Loading/Loading.js';

const Edit = () => {

  const [role, setRole] = useState()
  const isAuthenticated = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const token = Cookies.get('token');
    if (token) { 
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get('http://localhost:8000/api/user')
        .then((response) => {
          setRole(response.data.user.role)
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setIsLoading(false);
        });
    }
  }, []);

  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email:'',
    role:'',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/edit/${id}`);
      setUser(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/edit/${id}`, user);
      setShowModal(true)
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
    }
  };

  const options = ['admin', 'user'];
  
  const handleOptionSelect = (selectedOption) => {
    setUser((prevUser) => ({ ...prevUser, role: selectedOption }));
  };

  const goBack = () =>{
    navigate('/admin')
  }
  if (isLoading) {
    return <Loading />; 
  }
  if(isAuthenticated && role==='admin' && id!=1){
    return (
      <div className='edit-container'>
        <SideBar/>
        <div className='edit-form'>
          <div className='go-back' onClick={goBack}><div className='back-icon'></div></div>
          <form onSubmit={handleSubmit}>
            <h3><FormattedMessage id="admin5"/></h3>
            <div className='input-container'>
              <label><FormattedMessage id="admin1"/></label>
              <input
                type="text"
                name="firstname"
                value={user.firstname}
                onChange={handleInputChange}
              />
            </div>
            <div className='input-container'>
              <label><FormattedMessage id="admin2"/></label>
              <input
                type="text"
                name="lastname"
                value={user.lastname}
                onChange={handleInputChange}
              />
            </div>
            <div className='input-container'>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
              />
            </div>
            <div className='input-container'>
              <label><FormattedMessage id="admin3"/></label>
              <div className='role'>
                <Dropdown name={user.role} options={options} onSelect={handleOptionSelect} defaultValue={user.role}/>
              </div>
            </div>
            <button type="submit"><FormattedMessage id="admin5"/></button>
          </form>
        </div>
        {showModal && <SuccessModal id="user" message="User was updated successfully" />}
      </div>
    );
  }
  else{
    return(
      <NotFound/>
    )
  }
  }

export default Edit;
