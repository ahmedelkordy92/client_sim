import React from 'react';

const  Button = ({ text, onClick, icon, bkgColor}) => {
    return (
        <button 
          className="icon-button medium" 
          onClick={onClick}>
          {icon}
          {text && <span className="text">{text}</span>}
        </button>
    );
}

export default Button;