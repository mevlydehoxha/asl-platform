import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuth from '../../../Auth/useAuth.js';
import SideBar from '../../../shared/SideBar/SideBar.js';
import SuccessModal from '../../../shared/SuccessModal/SuccessModal.js';
import '../Video.scss'
import NotFound from '../../../shared/NotFound/NotFound.js';
import { FormattedMessage } from 'react-intl';
import Loading from '../../../shared/Loading/Loading.js';

const EditVideo = () => {

  const { id } = useParams();
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 
  const [role, setRole] = useState();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [videoPreviewFile, setVideoPreviewFile] = useState(null);
  const [displayVideo, setDisplayVideo] = useState(true)
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

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/signs-edit/${id}`);
      setFormData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories')
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
          console.log('An error occurred. Our team has been notified.');
        });
}, []);

  const [formData, setFormData] = useState({
    category_id: '',
    video: '',
    image: null,
    title_albanian: '',
    title_english: '',
    description: '',
  }); 

  const handleChange = (e) => {
    const { name, type, files } = e.target;
    if (type === 'file' && files[0]) {
      const selectedFile = files[0];
      if (name === 'video') {
        setVideoPreviewFile(selectedFile);
        setDisplayVideo(false)

      } else if (name === 'image') {
        setImagePreviewUrl(URL.createObjectURL(selectedFile));
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedFile,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (videoPreviewFile) {
        URL.revokeObjectURL(URL.createObjectURL(videoPreviewFile));
      }
    };
  }, [videoPreviewFile]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.video || !formData.title_albanian || !formData.title_english || !formData.category_id) {
      setError('Please fill in required fields.');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', formData.video);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('title_albanian', formData.title_albanian);
      formDataToSend.append('title_english', formData.title_english);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id);
      await axios.post(`http://localhost:8000/api/signs-edit/${id}`, formDataToSend,{
        method:'PUT'
      })
      .then(response => {
        setShowModal(true)
      })
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
    }
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
        <div className='form-container edit'>
          <div className='go-back' onClick={goBack}><div className='back-icon'></div></div>
          <form onSubmit={handleSubmit}>
            <h2><FormattedMessage id="home10"/></h2>
              <div className='input-container'>
                <label>Video</label>
                <input
                    type="file"
                    name="video"
                    onChange={handleChange}
                    className='file'
                />
              </div>
             {displayVideo ? 
              <video poster="" autoPlay controls width="250" className='display-item'>
                <source key={formData.video} src={videoPreviewFile ? URL.createObjectURL(videoPreviewFile) : `http://localhost:8000/storage/${formData.video}`} type="video/mp4" className='display-item'/>
                <source key={formData.video} src={videoPreviewFile ? URL.createObjectURL(videoPreviewFile) : `http://localhost:8000/storage/${formData.video}`} type="video/ogg"></source>
                Your browser does not support the video tag.
              </video> : <div></div>
             }
              {videoPreviewFile ? 
               <video poster="" autoPlay controls width="250" className='display-item'>
                <source key={formData.video} src={URL.createObjectURL(videoPreviewFile)} type="video/mp4" className='display-item'/>
                <source key={formData.video} src={URL.createObjectURL(videoPreviewFile)} type="video/ogg"></source>
                Your browser does not support the video tag.
              </video> : <div></div>
              }
              <div className='input-container'>
                <label><FormattedMessage id="home2"/></label>
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className='file'
                />
             <img src={imagePreviewUrl || `http://localhost:8000/storage/${formData.image}`} alt={formData.title_english} className='users-item'/>
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home3"/></label>
                <input
                    type="text"
                    name="title_albanian"
                    value={formData.title_albanian}
                    onChange={handleChange}
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home4"/></label>
                <input
                    type="text"
                    name="title_english"
                    value={formData.title_english}
                    onChange={handleChange}
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home5"/></label>
                <textarea
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home1"/></label>
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                >
                    <option value=""><FormattedMessage id="select-category"/></option>
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
              <button type="submit"><FormattedMessage id="home10"/></button>
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

export default EditVideo;
