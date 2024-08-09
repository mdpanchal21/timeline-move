import React, { useState } from 'react';
import './App.css';
import Timeline from './timeline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, subDays, addDays, isSameDay } from 'date-fns';

function App() {
  const today = format(new Date(), 'dd_MM_yy'); // Get today's date in 'DD_MM_YY' format
  const [videoDate, setVideoDate] = useState(today); // Initial date

  const handleArrowClick = (direction) => {
    // Parse the current date string
    const [day, month, year] = videoDate.split('_').map(Number);
    const currentDate = new Date(`20${year}`, month - 1, day);

    // Adjust the date based on the direction ('left' or 'right')
    const newDate = direction === 'left' ? subDays(currentDate, 1) : addDays(currentDate, 1);

    // Format the date back to 'DD_MM_YY'
    const formattedDate = format(newDate, 'dd_MM_yy');

    // Update the state
    setVideoDate(formattedDate);
  };

  const isToday = videoDate === today; // Check if the current video date is today

  return (
    <div style={{ paddingLeft: '110px' }}>
      <h1>Zoomable Timeline</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ArrowBackIosNewIcon 
          onClick={() => handleArrowClick('left')} 
          style={{ cursor: 'pointer', marginRight: '10px' }} 
        />
        <ArrowForwardIosIcon 
          onClick={() => !isToday && handleArrowClick('right')} 
          style={{ cursor: isToday ? 'not-allowed' : 'pointer', marginLeft: '10px', opacity: isToday ? 0.5 : 1 }} 
        />
      </div>
      <Timeline videoDate={videoDate} />
    </div>
  );
}

export default App;
