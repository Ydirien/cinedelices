import { useState } from 'react'; // 1. Ne pas oublier d'importer useState
import { Link, NavLink } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import '../AuthPages.css';

export default function Register() {
  // État pour stocker le mot de passe
  const [password, setPassword] = useState('');

  // Fonction pour évaluer la force du mot de passe (score de 0 à 4)
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Vide', className: 'none' };
    
    let score = 0;
    
    // Critère 1 : Longueur (au moins 8 caractères, idéalement 12)
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    // Critère 2 : Contient des minuscules ET des majuscules
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    
    // Critère 3 : Contient des chiffres ou des caractères spéciaux
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    // Retourne le texte et la classe CSS correspondante
    switch (score) {
      case 1:
        return { score, label: 'Faible', className: 'weak' };
      case 2:
      case 3:
        return { score, label: 'Moyen', className: 'medium' };
      case 4:
        return { score, label: 'Fort', className: 'strong' };
      default:
        return { score, label: 'Très Faible', className: 'very-weak' };
    }
  };

  const strength = getPasswordStrength(password);

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
              {/* 2. On lie la valeur et le onChange à notre state */}
              <input 
                type="password" 
                placeholder="12 caractères minimum..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <label>Mot de passe</label>
              <input type="password" placeholder="Confirmer le mot de passe..." />
            </div>

            {/* 3. On applique dynamiquement le label et la classe CSS */}
            {password && (
              <div className="password-strength-wrapper">
                <div className={`password-strength-bar ${strength.className}`}></div>
                <span className="password-strength-text">{strength.label}</span>
              </div>
            )}
            <button type="submit" className="auth-submit-btn">Suivant</button>
          </form>

          <NavLink to="/login" className="auth-back-to-login">
            Déjà un compte ? Se connecter
          </NavLink>
        </div>
      </div>
    </div>
  );
}