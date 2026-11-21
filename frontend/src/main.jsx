import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// fonts and global styles first so component styles can override them
import './styles/fonts';
import './styles/global.css';
import App from './App';
import { initSmoothScroll } from './utils/smoothScroll';

// start Lenis before the first render so scroll-driven components can subscribe to it
initSmoothScroll();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
