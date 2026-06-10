import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';

function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  useEffect(() => {
    const data = localStorage.getItem('User');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  if (!user) return <p>Chargement...</p>;
  return (
    <main className="user-profile-page">
      <section className="user-profile-card">
        <h1>Mon profil</h1>

        <div className="user-profile-info">
          <p>
            <strong>Pseudo :</strong> {user.username}
          </p>

          <p>
            <strong>Email :</strong> {user.email}
          </p>

          <p>
            <strong>Rôle :</strong> {user.role}
          </p>

          <p>
            <strong>Membre depuis :</strong> {user.createdAt}
          </p>
        </div>

        <div className="user-profile-actions">
          <button className="btn-edit" type="button">
            Modifier mon profil
          </button>
          <button className="btn-my-recipes" type="button">
            Mes recettes
          </button>
          <button className="btn-logout" type="button" onClick={handleLogout}>
            Déconnection
          </button>
        </div>
      </section>
    </main>
  );
}

export default UserProfilePage;
