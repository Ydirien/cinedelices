import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminProfilePage.css';
import { apiFetch } from '../../lib/apiClient';

function ProfilePage() {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    async function fetchDataProfile() {
      const res = await apiFetch('/api/profile');
      if (!res.ok) return;
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
