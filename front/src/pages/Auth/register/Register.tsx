import { Link } from 'react-router-dom';
import '../AuthPages.css';

export default function Register() {
  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-form-wrapper">
          <h2 className="auth-title">Inscription</h2>
          
          <div className="auth-upload-wrapper">
            <div className="auth-upload-box">
              <span className="material-icons">image</span>
              <div className="auth-upload-plus">+</div>
            </div>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-input-group">
              <label>Pseudo</label>
              <input type="text" placeholder="pseudo123" />
            </div>

            <div className="auth-input-group">
              <label>Email</label>
              <input type="email" placeholder="exemple@exemple.com" />
            </div>

            <div className="auth-input-group">
              <label>Mot de passe</label>
              <input type="password" placeholder="12 caractères minimum..." />
            </div>

            <div className="auth-input-group">
              <label>Mot de passe</label>
              <input type="password" placeholder="Confirmer le mot de passe..." />
            </div>

            <div className="password-strength-wrapper">
              <div className="password-strength-bar medium"></div>
              <span className="password-strength-text">Moyen</span>
            </div>

            <button type="submit" className="auth-submit-btn">—</button>
          </form>

          <Link to="/login" className="auth-back-to-login">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}