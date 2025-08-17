import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'green',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>
        <h1>🎉 REACT IS WORKING! 🎉</h1>
        <p>Green background = React is rendering!</p>
        <p>Your portfolio should be working now!</p>
      </div>
    </div>
  );
};

export default SimpleTest;
