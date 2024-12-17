import React from 'react';

const  IconAfterButton = ({ text, onClick, icon, bkgColor}) => {
    return (
        <button 
          className="icon-button semibold" 
          onClick={onClick}>
          {icon}
          {text && <span className="text">{text}</span>}
        </button>
    );
}

export default IconAfterButton;