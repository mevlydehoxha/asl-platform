import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import SuccessModal from '../../shared/SuccessModal/SuccessModal.js';
import SideBar from '../../shared/SideBar/SideBar.js';
import useAuth from '../../Auth/useAuth';
import '../News.scss'
import NotFound from '../../shared/NotFound/NotFound.js';
import { FormattedMessage } from 'react-intl';
import Loading from '../../shared/Loading/Loading.js';

const EditNews = () => {

  const { id } = useParams();
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 
  const [role, setRole] = useState();
  const [showModal, setShowModal] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [videoPreviewFile, setVideoPreviewFile] = useState(null);
  const [displayVideo, setDisplayVideo] = useState(true);
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

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/news-edit/${id}`);
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

  const [formData, setFormData] = useState({
    video: '',
    image: '',
    title: '',
    description: '',
    others: '',
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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', formData.video);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('others', formData.others);
      await axios.post(`http://localhost:8000/api/news-edit/${id}`, formDataToSend,{
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
    navigate('/news-admin')
  }

  if (isLoading) {
    return <Loading />; 
  }

  if(isAuthenticated && role==='admin'){
    return (
    <div className='create-news'>
        <SideBar/>
        <div className='form-container edit'>
          <div className='go-back' onClick={goBack}><div className='back-icon'></div></div>
          <form onSubmit={handleSubmit}>
            <h2><FormattedMessage id="news4"/></h2>
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
             <img src={imagePreviewUrl || `http://localhost:8000/storage/${formData.image}`} alt={formData.title} className='users-item'/>
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="news1"/></label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="home5"/></label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
              </div>
              <div className='input-container'>
                <label><FormattedMessage id="news2"/></label>
                <textarea
                    type="text"
                    name="others"
                    value={formData.others}
                    onChange={handleChange}
                />
              </div>
              <button type="submit"><FormattedMessage id="news4"/></button>
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

export default EditNews;
