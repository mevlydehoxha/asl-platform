import React, { useEffect, useState } from 'react';
import '../../../Admin/Edit/Edit.scss'
import axios from 'axios';
import SideBar from '../../../shared/SideBar/SideBar';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../../shared/SuccessModal/SuccessModal';
import Cookies from 'js-cookie';
import NotFound from '../../../shared/NotFound/NotFound';
import useAuth from '../../../Auth/useAuth';
import Loading from '../../../shared/Loading/Loading';
import { FormattedMessage } from 'react-intl';


const CategoryModal = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('')
    const [role, setRole] = useState([])
    const isAuthenticated = useAuth();
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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            setError('Please fill in required field.');
            return;
          }
        axios.post('http://localhost:8000/api/categories', { name })
          .then(response => {
            setShowModal(true)
            setName('')
            setIsLoading(false);
          })
          .catch(error => {
            console.log('An error occurred. Our team has been notified.');
            setIsLoading(false);
          });
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category name"
                    />
                    </div>
                    {error ? 
                    <p className='error'>{error}</p> 
                    : ''}
                    <button type="submit"><FormattedMessage id='add-category'/></button>
                </form>
            </div>
            {showModal && <SuccessModal id="data-created" message="Data was created successfully."/>}
        </div>
    );
   }
   else{
    return(
        <NotFound/>
    )
   }
};

export default CategoryModal;

