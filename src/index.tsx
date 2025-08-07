import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/App.scss';

import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);