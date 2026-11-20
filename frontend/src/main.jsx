import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// global styles first so component styles can override them
import './styles/global.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
