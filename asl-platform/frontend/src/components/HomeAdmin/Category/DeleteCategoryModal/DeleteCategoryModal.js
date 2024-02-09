import React, { useState } from 'react';
import axios from 'axios';
import '../CategoryModal/CreateEditCategory.scss'; 
import { FormattedMessage } from 'react-intl';


const DeleteCategoryModal = ({ isOpen, onClose,id, setDeletedUserId, selectedId}) => {
    if (!isOpen || id !== selectedId) return null; 
    
    const handleDelete = () =>{
        axios.delete(`http://localhost:8000/api/categories/${id}`)
        .then((response) => {
            setDeletedUserId(id); 
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
            <h1><FormattedMessage id='delete-category'/></h1>
            <div className='close-button' onClick={onClose}></div>
        </div>
        <hr/>
        <p><FormattedMessage id='are-you-sure-category'/></p>
        <div className='buttons'>
            <button className='cancel' onClick={onClose}><FormattedMessage id='cancel'/></button>
            <button className='danger' onClick={handleDelete}><FormattedMessage id='delete'/></button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
