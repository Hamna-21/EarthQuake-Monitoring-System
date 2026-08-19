import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '@/app/App.tsx';
import '@/styles/globals.css';
import "leaflet/dist/leaflet.css";

// Mount the single application root and keep React's development checks enabled.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
