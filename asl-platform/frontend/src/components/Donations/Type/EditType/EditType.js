import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../Admin/Edit/Edit.scss'
import Cookies from 'js-cookie';
import useAuth from '../../../Auth/useAuth.js';
import SideBar from '../../../shared/SideBar/SideBar.js';
import SuccessModal from '../../../shared/SuccessModal/SuccessModal'
import NotFound from '../../../shared/NotFound/NotFound';
import { FormattedMessage } from 'react-intl';
import Loading from '../../../shared/Loading/Loading.js';

const EditType = () => {

  const [role, setRole] = useState()
  const isAuthenticated = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate()
  const [error, setError] = useState('')
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

  const [type, setType] = useState({
    type: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/type-edit/${id}`);
      setType(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setType({ ...type, [name]: value }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type.type) {
      setError('Please fill in required fields.');
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/type-edit/${id}`, type)
      .then(response => {
        setShowModal(true)
      })
    } catch (error) {
      console.error('Error updating type:', error);
    }
  };

  const goBack = () =>{
    navigate('/type')
  }

  if (isLoading) {
    return <Loading />; 
  }
  
  if(isAuthenticated && role==='admin'){
    return (
      <div className='edit-container'>
        <SideBar/>
        <div className='edit-form'>
          <div className='go-back' onClick={goBack}><div className='back-icon'></div></div>
          <form onSubmit={handleSubmit}>
            <div className='input-container'>
              <label><FormattedMessage id="home11"/></label>
              <input
                type="text"
                name="type"
                value={type.type}
                onChange={handleInputChange}
              />
            </div>
            {error ? 
            <p className='error'>{error}</p> 
            : ''}
            <button type="submit"><FormattedMessage id="home12"/></button>
          </form>
        </div>
        {showModal && <SuccessModal id="data" message="Data was updated successfully."/>}
      </div>
    );
  }
  else{
    return(
      <NotFound/>
    )
  }
  }

export default EditType;
