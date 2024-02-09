import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../shared/Navbar/Navbar.js'
import { FormattedMessage } from 'react-intl';

const FrontPageItem = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const navigate = useNavigate()

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/signs-edit/${id}`);
      setItems(response.data);
      const categoryIds = items.map((sign) => sign.category_id);
      axios.get(`http://localhost:8000/api/categories?id=${categoryIds.join(',')}`)
        .then((categoryResponse) => {
          const categoryMap = {};
          categoryResponse.data.forEach((category) => {
            categoryMap[category.id] = category.name;
          });
          setCategoryNames(categoryMap);
        })

    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const goBack = () =>{
    navigate('/')
  }
    return (
      <div>
        <Navbar/>
        <div className='frontpage-item'>
          <div>
            <video controls src={`http://localhost:8000/storage/${items.video}`} type="sample/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div className='frontpage-item-text'>
            <button className='go-back' onClick={goBack}>Go back</button>
            <h2><FormattedMessage id="alb-sign"/> - {items.title_albanian}</h2>
            <h2><FormattedMessage id="english-sign"/> - {items.title_english}</h2>
            <p><FormattedMessage id="home1"/> - <span>{categoryNames[items.category_id]}</span></p>
            <img src={`http://localhost:8000/storage/${items.image}`} alt={items.title_english}/>
            <p>{items.description}</p>
          </div>
        </div>
      </div>
    );
};

export default FrontPageItem;
