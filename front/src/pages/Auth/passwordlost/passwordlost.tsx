import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { API_URL } from '../../../constants';
import '../AuthPages.css';

export default function Passwordlost() {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
      }

      // Si tout est OK, on stocke le message de l'API :
      setMessage(data);
      setEmail(''); 

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
          <h2 className="auth-title">Mot de passe oublié</h2>
          {error && (
            <div className="auth-error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Affichage du message de succès */}
          {message ? (
            <div className="auth-success-message" style={{ color: 'green', marginBottom: '15px', textAlign: 'center', backgroundColor: '#e6f4ea', padding: '10px', borderRadius: '4px' }}>
              {message}
            </div>
          ) : (
            /* On n'affiche le formulaire que si aucun message de succès n'est présent (optionnel, mais plus propre) */
            <form className="auth-form" onSubmit={handleSubmit}>
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
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          )}

          <NavLink to="/login" className="auth-back-to-login" style={{ marginTop: '15px', display: 'inline-block' }}>
            Déjà un compte ? Se connecter
          </NavLink>
        </div>
      </div>
    </div>
  );
}