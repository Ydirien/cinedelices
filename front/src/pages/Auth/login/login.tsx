import { Link, NavLink } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import '../AuthPages.css';

export default function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-form-wrapper">
          <h2 className="auth-title">Connexion</h2>
          
          <div className="auth-upload-wrapper">
            <LuCircleUser size={150}/>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>

            <div className="auth-input-group">
              <label>Email</label>
              <input type="email" placeholder="exemple@exemple.com" />
            </div>

            <div className="auth-input-group">
              <label>Mot de passe</label>
              <input type="password" placeholder="12 caractères minimum..." />
            </div>
            <button type="submit" className="auth-submit-btn">Connexion</button>
          </form>

          <NavLink to="/passwordlost" className="auth-back-to-login">
            Mot de passe oublié ? 
          </NavLink>
        </div>
      </div>
    </div>
  );
}