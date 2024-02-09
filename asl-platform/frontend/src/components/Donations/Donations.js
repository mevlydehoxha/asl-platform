import './Donations.scss';
import Navbar from '../shared/Navbar/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SuccessModal from '../shared/SuccessModal/SuccessModal';
import Cookies from 'js-cookie';
import Footer from '../shared/Footer/Footer'

const Donations = () => {
  const [type, setType] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState('');
  const token = Cookies.get('token');
  const [login, setLogin] = useState(false);
  const [error, setError] = useState('')

  useEffect(() => {
    if(token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get('http://localhost:8000/api/user')
        .then((response) => {
          setUserId(response.data.user.id);
        })
        .catch((error) => {
          console.log('An error occurred. Our team has been notified.');
        });
      }
  }, []);

  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    description: '',
    type_id: '',
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      user_id: userId, 
    }));
  }, [userId]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.type_id || !formData.description) {
      setError('Please fill in required fields.');
      return;
    }
    if (token) {
      axios
        .post('http://localhost:8000/api/donations', formData)
        .then((response) => {
          setShowModal(true);
          setFormData({
            user_id: userId,
            title: '',
            description: '',
            type_id: '',
          });
        })
        .catch((error) => {
          console.log('An error occurred. Our team has been notified.');
        });
    } else {
      setLogin(true);
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/type')
      .then((response) => {
        setType(response.data);
      })
      .catch((error) => {
        console.log('An error occurred. Our team has been notified.');
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className='donations'>
        <form onSubmit={handleSubmit}>
          <h6 className='quote-h6'>
            <i>“We can't help everyone, but…Everyone can help someone.”</i>
          </h6>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            placeholder='Title of the donation'
          />
          <textarea
            type='text'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Description'
          />
          <div className='input-container'>
            <select
              name='type_id'
              value={formData.type_id}
              onChange={handleChange}
            >
              <option value=''>Select a Donation Type</option>
              {type.map((typeItem) => (
                <option key={typeItem.id} value={typeItem.id}>
                  {typeItem.type}
                </option>
              ))}
            </select>
            {error ? 
          <p className='error'>{error}</p> 
          : ''}
          </div>
          <button type='submit'>Send Donation Request</button>
        </form>
      </div>
      {showModal && <SuccessModal id="donation" message="Thank you for donating!"/>}
      {login && (
        <SuccessModal id="login-first" message="Please log in first to make a donation. Thank you!" />
      )}
      <Footer/>
    </div>
  );
};

export default Donations;
