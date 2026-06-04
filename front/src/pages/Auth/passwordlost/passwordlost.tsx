import { Link, NavLink } from 'react-router-dom';
import '../AuthPages.css';

export default function Passwordlost() {
  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-form-wrapper">
          <h2 className="auth-title">Mot de passe oublié</h2>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>

            <div className="auth-input-group">
              <label>Email</label>
              <input type="email" placeholder="exemple@exemple.com" />
            </div>
            <button type="submit" className="auth-submit-btn">Envoyer</button>
          </form>

          <NavLink to="/login" className="auth-back-to-login">
            Déjà un compte ? Se connecter
          </NavLink>
        </div>
      </div>
    </div>
  );
}