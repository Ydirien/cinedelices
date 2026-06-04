import { Link } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import '../AuthPages.css';

export default function Register() {
  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-form-wrapper">
          <h2 className="auth-title">Inscription</h2>
          
          <div className="auth-upload-wrapper">
            <LuCircleUser size={150}/>
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

            <button type="submit" className="auth-submit-btn">Suivant</button>
          </form>

          <Link to="/login" className="auth-back-to-login">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}