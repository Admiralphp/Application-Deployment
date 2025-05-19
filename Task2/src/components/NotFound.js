import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page non trouvée</h2>
      <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link to="/" className="home-link">Retourner à l'accueil</Link>
    </div>
  );
}

export default NotFound;