import { Link } from 'react-router-dom';
import './AdminProfilePage.css';

function AdminProfilePage() {
  const admin = {
    pseudo: 'Administrateur CinéDélices',
    firstName: 'Admin',
    lastName: 'CinéDélices',
    email: 'admin@cinedelices.fr',
    role: 'Administrateur',
    createdAt: 'Juin 2026',
  };

  return (
    <main className="admin-profile-page">
      <section className="admin-profile-card">
        <h1>Profil administrateur</h1>

    

        <div className="admin-profile-info">
          <p>
            <strong>Pseudo :</strong> {admin.pseudo}
          </p>

          <p>
            <strong>Prénom :</strong> {admin.firstName}
          </p>

          <p>
            <strong>Nom :</strong> {admin.lastName}
          </p>

          <p>
            <strong>Email :</strong> {admin.email}
          </p>

          <p>
            <strong>Rôle :</strong> {admin.role}
          </p>

          
        </div>

        <div className="admin-profile-actions">
          <Link to="/admin" className="admin-profile-button">
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

export default AdminProfilePage;