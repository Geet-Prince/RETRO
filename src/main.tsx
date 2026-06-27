// WebView SessionStorage Persistence Polyfill for Firebase OAuth redirects
try {
  if (typeof window !== "undefined") {
    // 1. Restore all firebase-related keys from localStorage back to sessionStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("firebase:") || key.includes("firebase"))) {
        const val = localStorage.getItem(key);
        if (val !== null) {
          sessionStorage.setItem(key, val);
        }
      }
    }

    // 2. Intercept sessionStorage writes to mirror them to localStorage
    const originalSet = sessionStorage.setItem;
    sessionStorage.setItem = function (key, value) {
      if (key.startsWith("firebase:") || key.includes("firebase")) {
        localStorage.setItem(key, value);
      }
      originalSet.apply(this, [key, value]);
    };

    // 3. Intercept sessionStorage removes to mirror them to localStorage
    const originalRemove = sessionStorage.removeItem;
    sessionStorage.removeItem = function (key) {
      if (key.startsWith("firebase:") || key.includes("firebase")) {
        localStorage.removeItem(key);
      }
      originalRemove.apply(this, [key]);
    };
  }
} catch (e) {
  console.warn("Firebase WebView storage polyfill error:", e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
