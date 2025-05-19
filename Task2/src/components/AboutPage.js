import React from 'react';
import '../styles/AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      <h1>À propos</h1>
      
      <section className="about-section">
        <h2>Notre projet</h2>
        <p>Cette application est un projet de démonstration qui illustre l'utilisation de React.js avec un déploiement optimisé via Docker. 
        Elle montre comment configurer correctement une Single Page Application (SPA) pour la production.</p>
      </section>
      
      <section className="about-section">
        <h2>Technologies utilisées</h2>
        <ul>
          <li><strong>React:</strong> Bibliothèque JavaScript pour construire l'interface utilisateur</li>
          <li><strong>React Router:</strong> Pour la navigation entre les pages</li>
          <li><strong>Docker:</strong> Pour le déploiement et la conteneurisation</li>
          <li><strong>Nginx:</strong> Serveur web pour servir l'application en production</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;