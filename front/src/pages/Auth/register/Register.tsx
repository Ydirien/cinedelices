import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import { LuCircleUser } from 'react-icons/lu';
import '../AuthPages.css';

export default function Register() {
  // États pour récupérer les valeurs des inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // États pour gérer les messages de l'API
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  // Fonction pour évaluer la force du mot de passe
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Vide', className: 'none' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1: return { score, label: 'Faible', className: 'weak' };
      case 2:
      case 3: return { score, label: 'Moyen', className: 'medium' };
      case 4: return { score, label: 'Fort', className: 'strong' };
      default: return { score, label: 'Très Faible', className: 'very-weak' };
    }
  };

  const strength = getPasswordStrength(password);

  // empecher le rechargement de la page
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3010/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription.");
      }

      // Si l'inscription réussit :
      console.log('Utilisateur inscrit avec succès !', data);
      
      // Redirection vers la page de connexion
      navigate('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Inscription</h2>
          
          <div className="auth-upload-wrapper">
            <LuCircleUser size={150}/>
          </div>

          {/* Affichage des erreurs si l'API en renvoie */}
          {error && <div className="auth-error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Pseudo</label>
              <input 
                type="text" 
                placeholder="pseudo123" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="exemple@exemple.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Mot de passe</label>
              <input 
                type="password" 
                placeholder="12 caractères minimum..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Confirmer le mot de passe</label>
              <input 
                type="password" 
                placeholder="Confirmer le mot de passe..." 
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {password && (
              <div className="password-strength-wrapper">
                <div className={`password-strength-bar ${strength.className}`}></div>
                <span className="password-strength-text">{strength.label}</span>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Inscription en cours...' : 'Suivant'}
            </button>
          </form>

          <NavLink to="/login" className="auth-back-to-login">
            Déjà un compte ? Se connecter
          </NavLink>
        </div>
      </div>
    </div>
  );
}