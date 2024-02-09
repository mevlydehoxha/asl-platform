import React, { useState, useEffect } from 'react';
import './SucessModal.scss'
import { FormattedMessage } from 'react-intl';

const SuccessModal = ({message, id}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h1><FormattedMessage id={id} defaultMessage={message}/></h1>
        <p><FormattedMessage id="modal"/></p>
      </div>
    </div>
  );
};

export default SuccessModal;
