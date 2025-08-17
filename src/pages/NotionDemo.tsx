import React from 'react'
import { ArrowLeft } from 'lucide-react'
import NotionHero from '../components/NotionHero'

const NotionDemo: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      
      <NotionHero />
    </div>
  )
}

export default NotionDemo 