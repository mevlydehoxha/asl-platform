import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../../shared/SideBar/SideBar';
import useAuth from '../../Auth/useAuth';
import SuccessModal from '../../shared/SuccessModal/SuccessModal';
import '../News.scss'
import NotFound from '../../shared/NotFound/NotFound';
import { FormattedMessage } from 'react-intl';
import Loading from '../../shared/Loading/Loading';


const CreateNews = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 
  const [role, setRole] = useState();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
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

  const [formData, setFormData] = useState({
    video: '',
    image: null,
    title: '',
    description: '',
    others: '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
        setFormData(prevData => ({
            ...prevData,
            [name]: e.target.files[0], 
        }));
    } else {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.image || !formData.video || !formData.title) {
      setError('Please fill in required fields.');
      return;
    }
    const formDataToSend = new FormData();

    for (const key in formData) {
        if (key !== 'image') {
            formDataToSend.append(key, formData[key]);
        }
    }
    formDataToSend.append('image', formData.image);
    axios.post('http://localhost:8000/api/news', formDataToSend)
        .then(response => {
          setShowModal(true)
          setIsLoading(false);
        })
        .catch(error => {
          console.log('An error occurred. Our team has been notified.');
          setIsLoading(false);
        });
  };

  const goBack = () =>{
    navigate('/news-admin')
  }

  if (isLoading) {
    return <Loading />; 
  }

  if(isAuthenticated && role==='admin'){
    return (
      <div className='create-news'>
        <SideBar/>
        <div className='form-container'>
          <div className='go-back' onClick={goBack}><div className='back-icon'></div></div>
          <form onSubmit={handleSubmit}>
            <h2><FormattedMessage id="news3"/></h2>
              <div className='input-container'>
                <label>Video</label>
                <input
                type="file"
                name="video"
                onChange={handleChange}
                placeholder="Video"
                className='file'
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home2"/></label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className='file'
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="news1"/></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="donation3"/></label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="news2"/></label>
                <textarea
                  name="others"
                  value={formData.others}
                  onChange={handleChange}
                  placeholder="Other information"
                />
              </div>
              {error ? 
              <p className='error'>{error}</p> 
              : ''}
              <button type="submit"><FormattedMessage id="home9"/></button>
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

export default CreateNews;
