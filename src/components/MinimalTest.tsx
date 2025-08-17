import React from 'react';

const MinimalTest: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'red',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>
        <h1>MINIMAL TEST</h1>
        <p>If you see this red screen, React is working!</p>
        <p>No external CSS or components needed.</p>
      </div>
    </div>
  );
};

export default MinimalTest;
