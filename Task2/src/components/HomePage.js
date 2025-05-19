import React from 'react';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Bienvenue sur notre application React</h1>
        <p>Cette application de démonstration est conçue pour illustrer les fonctionnalités de React et le déploiement avec Docker.</p>
      </section>
      
      <section className="features">
        <h2>Fonctionnalités</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>React Router</h3>
            <p>Navigation fluide entre les pages sans rechargement complet.</p>
          </div>
          <div className="feature-card">
            <h3>Responsive Design</h3>
            <p>Interface adaptée à tous les appareils et tailles d'écran.</p>
          </div>
          <div className="feature-card">
            <h3>Docker Ready</h3>
            <p>Prêt à être déployé dans un conteneur Docker optimisé.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;