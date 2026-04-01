import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Sourire Excellence</h3>
          <p>
            L'excellence au service de votre sourire. Des soins dentaires de qualité supérieure 
            dans un cadre luxueux et accueillant.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">f</a>
            <a href="#" className="social-link">𝕏</a>
            <a href="#" className="social-link">in</a>
            <a href="#" className="social-link">📷</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>123 Avenue de la République<br />75011 Paris</p>
          <p>+33 1 23 45 67 89</p>
          <p>contact@sourire-excellence.fr</p>
        </div>

        <div className="footer-section">
          <h4>Horaires</h4>
          <p>Lun - Ven: 9h00 - 19h00</p>
          <p>Samedi: 9h00 - 14h00</p>
          <p>Dimanche: Fermé</p>
        </div>

        <div className="footer-section">
          <h4>Liens utiles</h4>
          <p><a href="#">Politique de confidentialité</a></p>
          <p><a href="#">Conditions d'utilisation</a></p>
          <p><a href="#">Mentions légales</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Sourire Excellence. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
