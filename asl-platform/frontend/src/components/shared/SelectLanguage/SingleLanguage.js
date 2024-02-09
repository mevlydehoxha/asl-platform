import React from 'react';

export default function SingleLanguage(props) {
    return (
    <div>
        <div
          className={`single-language ${props.styles}`}
          onClick={props.handleLanguageChange }
        >
      
            <div  className='flag'>
              <img src={props.flag} alt='flag' />
            </div>
            <div className='text'>
              <span>{props.language}</span>
            </div>
            
        </div>
    </div>
  );
}