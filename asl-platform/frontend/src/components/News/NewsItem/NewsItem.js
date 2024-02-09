import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../shared/Navbar/Navbar'
import '../News.scss'

const NewsItem = () => {
  const { id } = useParams();
  const [items, setItems] = useState([])

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/news-edit/${id}`);
      setItems(response.data);
    } catch (error) {
      console.log('An error occurred. Our team has been notified.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

    return (
      <div>
        <Navbar/>
        <div className='news-items'>
          <video controls muted src={`http://localhost:8000/storage/${items.video}`} type="sample/mp4">
              Your browser does not support the video tag.
          </video>
          <h2>{items.title}</h2>
          <p>{items.description}</p>
          {items.others ? 
          <p>Important info - {items.others}</p>
         : ''}
        </div>
      </div>
    );
};

export default NewsItem;
