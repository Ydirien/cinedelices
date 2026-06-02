import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>Ciné Délices</h2>
          <p>
            Des recettes inspirées de vos films, séries et animés préférés 🍿
          </p>
        </div>

        <div className="footer-links">
          <Link to="/mentions-legales">
            Mentions légales
          </Link>

          <Link to="/confidentialite">
            Politique de confidentialité
          </Link>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Ciné Délices - Tous droits réservés</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;