import React, { useState, useEffect } from 'react';
import { Progress } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const PageOverlayProgressBar = ({progress}) => {

  return (
    <div style={overlayStyle}>
      <div style={progressContainerStyle}>
        <Progress value={progress} animated className="my-3" />
        <p style={{ color: '#fff', marginTop: '10px' }}>{progress}%</p>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const progressContainerStyle = {
  width: '50%',
  textAlign: 'center',
};

export default PageOverlayProgressBar;
