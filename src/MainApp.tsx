import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import NotionDemo from './pages/NotionDemo';

function MainApp() {
  return (
    <Router>
      <div className="animate-fade-in">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/notion-demo" element={<NotionDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default MainApp;
