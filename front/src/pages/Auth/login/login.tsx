import { useState } from 'react'; 
import { NavLink, useNavigate } from 'react-router-dom'; 
import { LuCircleUser } from 'react-icons/lu';
import '../AuthPages.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3010/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Identifiants incorrects');
    }

      localStorage.setItem('accessToken', data.accessToken.token);
      localStorage.setItem('refreshToken', data.refreshToken.token);

      console.log('Connexion réussie !');
      
      navigate('/'); 

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
          <h2 className="auth-title">Connexion</h2>
          <div className="auth-upload-wrapper">
            <LuCircleUser size={150}/>
          </div>

          {error && (
            <div className="auth-error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}

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

            <div className="auth-input-group">
              <label>Mot de passe</label>
              <input 
                type="password" 
                placeholder="Votre mot de passe..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Connexion...' : 'Connexion'}
            </button>
          </form>

          <div>
            <NavLink to="/passwordlost" className="auth-back-to-login">
              Mot de passe oublié ? 
            </NavLink>
            <NavLink to="/register" className="auth-back-to-login">
              Pas encore de compte ? 
            </NavLink>
          </div>
          
        </div>
      </div>
    </div>
  );
}