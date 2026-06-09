import { useEffect, useState } from 'react';
import './UserProfilePage.css';

function UserProfilePage() {
  const [user,SetUser] = useState({
    username: '',
    email: '',
    role: '',
    createdAt: '',
  });

  async function fetcher(){
     const response = await fetch('http://localhost:3010/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
           "Authorization": `Bearer ${localStorage.getItem("accessToken")}` 
        },
      });

      if (!response.ok) {
      throw new Error('Internal error');
      }

      const data = await response.json();
       SetUser(data);
  };

  useEffect(() => {
    fetcher();
  },[])

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
          <button type="button">Modifier mon profil</button>
          <button type="button">Mes recettes</button>
        </div>
      </section>
    </main>
  );
}

export default UserProfilePage;