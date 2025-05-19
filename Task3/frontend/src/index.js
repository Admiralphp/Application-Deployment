// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';

// Configuration globale d'Axios pour gérer les sessions et cookies CSRF
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://api-gateway:3000'; // URL du service API Gateway dans Docker Compose

axios.defaults.withCredentials = true; // Pour permettre l'envoi des cookies avec les requêtes

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  response => response,
  error => {
    // Si une erreur 401 est reçue, l'utilisateur n'est pas authentifié
    if (error.response && error.response.status === 401) {
      console.log('Session expirée ou non authentifiée');
      // Vous pourriez rediriger vers la page de connexion ou effacer les données utilisateur
    }
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);