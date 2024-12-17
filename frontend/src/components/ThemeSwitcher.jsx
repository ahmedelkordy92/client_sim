import { useState } from 'react';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const CustomStyledSwitch  = styled(Switch)(({ theme }) => ({
  width: 80, // Wider track
  height: 34, // Taller track
  padding: 0, // Remove any additional padding
  display: 'flex',
  alignItems: 'center', // Ensures overall alignment
  '& .MuiSwitch-switchBase': {
    padding: 2, // Adjust padding to keep thumb within track
    top: '50%', // Center switchBase vertically
    transform: 'translate(5px, -50%)', // Horizontal and vertical centering
    '&.Mui-checked': {
      transform: 'translate(50px, -50%)', // Horizontal and vertical centering when checked
      '& + .MuiSwitch-track': {
        backgroundColor: 'var(--toggle-bkg-color)', // Light green background
        borderColor: 'var(--toggle-border-color)', // Green border when checked
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 22, // Thumb size smaller than track
    height: 22, // Thumb size smaller than track
    backgroundColor: 'var(--thumb-bkg-color)', // Dark gray thumb
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Optional shadow for depth
    position: 'relative', // Relative to switchBase for proper alignment
  },
  '& .MuiSwitch-track': {
    borderRadius: 17, // Half the height for perfect oval
    backgroundColor: 'var(--toggle-bkg-color)', // Light background
    border: '2px solid var(--toggle-border-color)', // Light gray border
    boxSizing: 'border-box', // Ensures padding doesn’t affect dimensions
    width: '100%', // Full width of track
    height: '100%', // Full height of track
  },
}));

function ThemeSwitcher() {
  const [checked, setChecked] = useState(false);

  const handleToggle = (event, isChecked) => {
    setChecked(isChecked); // Update state
    if (isChecked) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  return (
    <CustomStyledSwitch 
      checked={checked}
      onChange={handleToggle}
    />
  );
}

export default ThemeSwitcher;