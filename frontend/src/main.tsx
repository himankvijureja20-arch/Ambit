import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import MobileFrame from './components/MobileFrame';
import { ToastProvider } from './components/ui/Toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <MobileFrame>
          <App />
        </MobileFrame>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
