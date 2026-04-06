import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './chartConfig.js'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('SW registered:', registration.scope);
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            if (confirm('Nueva versión disponible. ¿Recargar?')) {
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  });
}

const link = document.createElement('link');
link.rel = 'preload';
link.as = 'image';
link.href = '/assets/images/escudo.png';
document.head.appendChild(link);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
