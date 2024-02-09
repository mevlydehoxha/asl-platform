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


const CreateType = () => {
    const [type, setType] = useState('');
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
        if (!type) {
            setError('Please fill in required fields.');
            return;
          }
        axios.post('http://localhost:8000/api/type', { type })
          .then(response => {
            setShowModal(true)
            setType('')
            setIsLoading(false);
          })
          .catch(error => {
            console.log('An error occurred. Our team has been notified.');
            setIsLoading(false);
          });
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
                <label>Type</label>
                <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Type name"
                />
                </div>
                {error ? 
                <p className='error'>{error}</p> 
                : ''}
                <button type="submit">Add Type</button>
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

export default CreateType;

