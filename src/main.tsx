
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { forceContentfulProvider } from './services/cms/cmsInit'
import { toast } from 'sonner'

// Initialize application
const initApp = async () => {
  // Force use of Contentful provider
  forceContentfulProvider();
  toast.success('Using Contentful as CMS provider');
  
  // Render application
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
};

initApp();

