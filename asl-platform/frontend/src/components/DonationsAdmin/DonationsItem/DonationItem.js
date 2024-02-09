import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../Admin/Edit/Edit.scss'
import '../DonationsAdmin.scss'
import Cookies from 'js-cookie';
import useAuth from '../../Auth/useAuth';
import SideBar from '../../shared/SideBar/SideBar';
import NotFound from '../../shared/NotFound/NotFound';
import { FormattedMessage } from 'react-intl';
import Loading from '../../shared/Loading/Loading';

const DonationItem = () => {

  const [role, setRole] = useState()
  const isAuthenticated = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate()
  const[typeNames, setTypeNames] = useState()
  const[user, setUser] = useState()

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) { 
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get('http://localhost:8000/api/user')
        .then((response) => {
          setRole(response.data.user.role)
        })
        
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleString('en-US', options);
  }

  const [donation, setDonation] = useState({
    user_id: '',
    title:'',
    description:'',
    type_id:''
  });

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/donations/${id}`);
      setDonation(response.data);

      const userResponse = await axios.get(`http://localhost:8000/api/edit/${response.data.user_id}`);
      setUser(userResponse.data);

      const typeResponse = await axios.get(`http://localhost:8000/api/type/${response.data.type_id}`);
      setTypeNames(typeResponse.data[0]); 
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonation({ ...donation, [name]: value }); 
  };


  const goBack = () =>{
    navigate('/donations-admin')
  }
  if (!donation || !user || !typeNames) {
    return <Loading />; 
  }
  if(isAuthenticated && role==='admin'){
    return (
      <div className='edit-container dontations-edit'>
        <SideBar/>
        <div className='donations-view'>
          <div className='go-back' onClick={goBack}><div className='back-icon'></div></div>
          <div className='line'></div>
          <div>
          <div className='input-container'>
            <label><FormattedMessage id="home1"/></label>
            <div className='donation'>{typeNames.type}</div>
          </div>
          <div className='input-container'>
            <label><FormattedMessage id="donation6"/></label>
            <div className='donation'>{user.firstname} {user.lastname}</div>
          </div>
          <div className='input-container'>
            <label><FormattedMessage id="donation3"/></label>
            <div className='donation'>{donation.title}</div>
          </div>
          <div className='input-container'>
            <label><FormattedMessage id="home5"/></label>
            <div className='donation'>{donation.description}</div>
          </div>
          <div className='input-container'>
            <label><FormattedMessage id="donation5"/></label>
            <div className='donation'>{formatDate(donation.created_at)}</div>
          </div>
          </div>
        </div>
      </div>
    );
  }
  else{
    return(
      <NotFound/>
    )
  }
  }

export default DonationItem;
