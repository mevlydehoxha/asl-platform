import React  from 'react';
import './DeleteNews.scss'; 
import axios from 'axios';
import {FormattedMessage} from 'react-intl'


const DeleteNews = ({ isOpen, onClose,id, setDeletedNewsId, selectedId }) => {
    if (!isOpen || id !== selectedId) return null; 
    
    const handleDelete = () =>{
        axios.delete(`http://localhost:8000/api/news/${id}`)
        .then((response) => {
            setDeletedNewsId(id); 
        })
        .catch((error) => {
          console.log('An error occurred. Our team has been notified.');
        });
        onClose(true)
    }

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <div className='modal-header'>
            <h1><FormattedMessage id="news5"/></h1>
            <div className='close-button' onClick={onClose}></div>
        </div>
        <hr/>
        <p><FormattedMessage id="news6"/></p>
        <div className='buttons'>
            <button className='cancel' onClick={onClose}><FormattedMessage id="cancel"/></button>
            <button className='danger' onClick={handleDelete}><FormattedMessage id="delete"/></button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNews;
