import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">TEST COMPONENT</h1>
        <p className="text-xl">If you can see this, React is working!</p>
        <p className="text-lg mt-2">Red background means CSS is working too!</p>
      </div>
    </div>
  );
};

export default TestComponent;
