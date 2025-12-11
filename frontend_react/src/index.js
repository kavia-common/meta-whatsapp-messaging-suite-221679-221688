import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './state/store';
import httpClient, { onAuthEvent } from './api/httpClient';
import { getLoginUrl } from './api/authApi';

// Register a single global unauthorized handler to trigger re-auth redirects
onAuthEvent((event) => {
  if (event === 'unauthorized') {
    try {
      const currentUrl = window.location.href;
      const loginUrl = getLoginUrl(currentUrl);
      // Avoid infinite loops if we're already headed to login
      if (!loginUrl.includes('/auth/login')) {
        window.location.assign(loginUrl);
      }
    } catch (_e) {
      // ignore
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
