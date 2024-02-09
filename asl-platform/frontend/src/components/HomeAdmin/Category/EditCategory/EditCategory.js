import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../Admin/Edit/Edit.scss'
import Cookies from 'js-cookie';
import useAuth from '../../../Auth/useAuth.js';
import SideBar from '../../../shared/SideBar/SideBar.js';
import SuccessModal from '../../../shared/SuccessModal/SuccessModal';
import NotFound from '../../../shared/NotFound/NotFound';
import Loading from '../../../shared/Loading/Loading.js';
import { FormattedMessage } from 'react-intl';

const EditCategoryModal = () => {

  const [role, setRole] = useState()
  const isAuthenticated = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const token = Cookies.get('token');
    if (token) { 
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get('http://localhost:8000/api/user')
        .then((response) => {
          setRole(response.data.user.role);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setIsLoading(false);
        });
    }
  }, []);

  const [category, setCategory] = useState({
    name: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/categories-edit/${id}`);
      setCategory(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name) {
      setError('Please fill in required field.');
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/categories-edit/${id}`, category)
      .then(response => {
        setShowModal(true)
      })
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
    }
  };

  const goBack = () =>{
    navigate('/category')
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
              <label><FormattedMessage id='category'/></label>
              <input
                type="text"
                name="name"
                value={category.name}
                onChange={handleInputChange}
              />
            </div>
            {error ? 
              <p className='error'>{error}</p> 
            : ''}
            <button type="submit"><FormattedMessage id='edit-category'/></button>
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

export default EditCategoryModal;
