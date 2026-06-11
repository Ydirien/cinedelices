import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../constants/index';
import './AdminProfilePage.css';

function ProfilePage() {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    async function fetchDataProfile() {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Internal error');
      }
      const data = await res.json();
      setAdmin(data);
    }

    fetchDataProfile();
  }, []);

  if (!admin) return <p>Chargement...</p>;

  return (
    <main className="admin-profile-page">
      <section className="admin-profile-card">
        <h1>Mon Profil</h1>

        <div className="admin-profile-info">
          <p>
            <strong>Pseudo :</strong> {admin.username}
          </p>

          <p>
            <strong>Email :</strong> {admin.email}
          </p>

          <p>
            <strong>Rôle :</strong> {admin.role === "ADMIN" ? "Admin" : "Utilisateur"}
          </p>

          <p>
            <strong>Membre depuis :</strong>{' '}
            {new Date(admin.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="admin-profile-actions">
          <Link to="/admin/dashboard" className="admin-profile-button">
            Accéder au tableau de bord
          </Link>

          <button type="button" className="admin-profile-secondary-button">
            Modifier mon profil
          </button>
          </div>
      </section>
    </main>
  );
}

export default ProfilePage;
