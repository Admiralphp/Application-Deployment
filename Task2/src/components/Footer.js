import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Application React de démonstration</p>
        <div className="footer-links">
          <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a>
          <a href="https://fr.reactjs.org/docs/getting-started.html" target="_blank" rel="noopener noreferrer">Documentation</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;