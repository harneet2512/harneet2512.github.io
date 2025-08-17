import React, { useState, Suspense, lazy } from 'react';
import HARNEETPreloader from './components/HARNEETPreloader';

// Lazy load main content only after preloader completes
const MainApp = lazy(() => import('./MainApp'));

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-4">The app encountered an error while loading.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              Reload Page
            </button>
            <details className="mt-4 text-left text-sm">
              <summary className="cursor-pointer text-blue-400">Error Details</summary>
              <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handlePreloaderComplete = () => {
    try {
      setIsPreloaderComplete(true);
    } catch (err) {
      console.error('Preloader completion error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  // Error handling for the app
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">App Error</h1>
          <p className="text-gray-400 mb-4">Something went wrong while loading the app.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

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
    <ErrorBoundary>
      <div className="animate-fade-in">
        <Suspense fallback={
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading Portfolio...</p>
            </div>
          </div>
        }>
          <MainApp />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;