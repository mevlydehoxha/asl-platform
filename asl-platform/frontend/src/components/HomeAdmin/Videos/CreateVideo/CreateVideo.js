import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../../../shared/SideBar/SideBar';
import useAuth from '../../../Auth/useAuth';
import SuccessModal from '../../../shared/SuccessModal/SuccessModal';
import '../Video.scss'
import NotFound from '../../../shared/NotFound/NotFound';
import { FormattedMessage } from 'react-intl';
import Loading from '../../../shared/Loading/Loading';


const CreateVideo = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 
  const [role, setRole] = useState();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
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

  const [formData, setFormData] = useState({
    category_id: '',
    video: '',
    image: null,
    title_albanian: '',
    title_english: '',
    description: '',
  });


  useEffect(() => {
      axios.get('http://localhost:8000/api/categories')
          .then(response => {
              setCategories(response.data);
              setIsLoading(false);
          })
          .catch(error => {
            console.log('An error occurred. Our team has been notified.');
            setIsLoading(false);
          });
  }, []); 

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
    if (!formData.category_id || !formData.video || !formData.title_albanian || !formData.title_english) {
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
    axios.post('http://localhost:8000/api/signs', formDataToSend)
        .then(response => {
          setShowModal(true)
          formData.category_id=''
          formData.video=''
          formData.image=''
          formData.title_albanian=''
          formData.title_english=''
          formData.description=''
        })
        .catch(error => {
          console.log('An error occurred. Our team has been notified.');
        });
  };

  const goBack = () =>{
    navigate('/home-admin')
  }
  if (isLoading) {
    return <Loading />; 
  }
  if(isAuthenticated && role==='admin'){
    return (
      <div className='create-videos'>
        <SideBar/>
        <div className='form-container'>
          <div className='go-back' onClick={goBack}><div className='back-icon'></div></div>
          <form onSubmit={handleSubmit}>
            <h2><FormattedMessage id="home8"/></h2>
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
                <label><FormattedMessage id="home3"/></label>
                <input
                  type="text"
                  name="title_albanian"
                  value={formData.title_albanian}
                  onChange={handleChange}
                  placeholder="Title in Albanian"
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home4"/></label>
                <input
                  type="text"
                  name="title_english"
                  value={formData.title_english}
                  onChange={handleChange}
                  placeholder="Title in English"
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home5"/></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home1"/></label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value=""><FormattedMessage id="select-category" /></option>
                  {categories.map(category => (
                      <option key={category.id} value={category.id}>
                          {category.name}
                      </option>
                  ))}
                </select>
              </div>
              {error ? 
                <p className='error'>{error}</p> 
                : ''}
              <button type="submit"><FormattedMessage id="home9"/></button>
          </form>
        </div>
        {showModal && <SuccessModal id="video-created" message="Video was created successfully."/>}
      </div>
    );
  }
  else{
    return(
      <NotFound/>
    )
  }
};

export default CreateVideo;
