import React, { useState } from 'react';
import './DeleteVideo.scss'; 
import axios from 'axios';


const DeleteVideo = ({ isOpen, onClose,id, setDeletedSignId, selectedId }) => {
    if (!isOpen || id !== selectedId) return null; 
    
    const handleDelete = () =>{
        axios.delete(`http://localhost:8000/api/signs/${id}`)
        .then((response) => {
            setDeletedSignId(id); 
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
            <h1>Delete Video</h1>
            <div className='close-button' onClick={onClose}></div>
        </div>
        <hr/>
        <p>Are you sure you want to delete this video?</p>
        <div className='buttons'>
            <button className='cancel' onClick={onClose}>Cancel</button>
            <button className='danger' onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVideo;
