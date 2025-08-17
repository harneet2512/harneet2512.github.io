import { useState, useEffect, Suspense, lazy } from 'react';
import HARNEETPreloader from './components/HARNEETPreloader';

// Lazy load main content only after preloader completes
const MainApp = lazy(() => import('./MainApp'));

function App() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true);
  };

  // Phase 1: Show preloader
  if (!isPreloaderComplete) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <HARNEETPreloader onComplete={handlePreloaderComplete} />
      </div>
    );
  }

  // Phase 2: Show main portfolio after preloader completes
  return (
    <div className="animate-fade-in">
      <Suspense fallback={<div>Loading...</div>}>
        <MainApp />
      </Suspense>
    </div>
  );
}

export default App;