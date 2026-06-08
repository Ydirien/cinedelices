import './UserProfilePage.css';

function UserProfilePage() {
  const user = {
    pseudo: 'Utilisateur CinéDélices',
    firstName: 'John',
    lastName: 'Doe',
    email: 'utilisateur@cinedelices.fr',
    role: 'Utilisateur',
    createdAt: 'Juin 2026',
  };

  return (
    <main className="user-profile-page">
      <section className="user-profile-card">
        <h1>Mon profil</h1>


        <div className="user-profile-info">
          <p>
            <strong>Pseudo :</strong> {user.pseudo}
          </p>

          <p>
            <strong>Prénom :</strong> {user.firstName}
          </p>

          <p>
            <strong>Nom :</strong> {user.lastName}
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
          <button type="button">Modifier mon profil</button>
          <button type="button">Mes recettes</button>
        </div>
      </section>
    </main>
  );
}

export default UserProfilePage;