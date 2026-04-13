import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import App from './App';
import { restoreSession } from './redux/authActions';
import store from './redux/store';

// Restaurer la session utilisateur depuis localStorage
store.dispatch(restoreSession());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
