import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminUsersPage.css';
import { apiFetch } from '../../lib/apiClient';

type UserRole = 'USER' | 'ADMIN';

type AdminUser = {
  id: number;
  username?: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage('');
    }, 10000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [successMessage]);

  function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken') ?? localStorage.getItem('token');

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function fetchUsers() {
    try {
      const response = await apiFetch(`/api/admin/users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }

      const data: { data: AdminUser[] } = await response.json();

      setUsers(data.data);
    } catch (error) {
      setErrorMessage('Impossible de charger les utilisateurs.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleUpdateRole(userId: number, newRole: UserRole) {
    setErrorMessage('');
    setSuccessMessage('');

    const response = await apiFetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),

      body: JSON.stringify({
        role: newRole,
      }),
    });

    if (!response.ok) {
      setErrorMessage('Erreur lors du changement de rôle.');
      return;
    }

    const updatedUser: AdminUser = await response.json();

    setUsers((currentUsers) => currentUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)));

    setSuccessMessage('Le rôle de l’utilisateur a bien été modifié.');
  }

  async function handleDeleteUser(userId: number) {
    const confirmDelete = window.confirm('Supprimer définitivement cet utilisateur ?');

    if (!confirmDelete) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    const response = await apiFetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      setErrorMessage('Impossible de supprimer cet utilisateur. Il est peut-être lié à des recettes.');
      return;
    }

    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));

    setSuccessMessage('Utilisateur supprimé avec succès.');
  }

  if (isLoading) {
    return <p className="admin-users-message">Chargement des utilisateurs...</p>;
  }

  if (errorMessage && users.length === 0) {
    return <p className="admin-users-message">{errorMessage}</p>;
  }

  return (
    <>
      <section className="admin-users-header">
        <h1>Gestion des utilisateurs</h1>

        <div className="admin-users-header-actions">
          <Link to="/admin/dashboard">Retour au dashboard</Link>
        </div>
      </section>

      {successMessage && <p className="admin-users-success-message">{successMessage}</p>}

      {errorMessage && <p className="admin-users-error-message">{errorMessage}</p>}

      <section className="admin-users-table-container">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6}>Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>{user.username ?? 'Non renseigné'}</td>

                  <td>{user.email}</td>

                  <td>
                    <span className={`user-role ${user.role.toLowerCase()}`}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Utilisateur'}
                    </span>
                  </td>

                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non renseigné'}</td>

                  <td className="admin-users-actions">
                    {user.role === 'USER' ? (
                      <button
                        type="button"
                        className="promote-button"
                        onClick={() => handleUpdateRole(user.id, 'ADMIN')}
                      >
                        Passer admin
                      </button>
                    ) : (
                      <button type="button" className="demote-button" onClick={() => handleUpdateRole(user.id, 'USER')}>
                        Repasser user
                      </button>
                    )}

                    <button type="button" className="danger-button" onClick={() => handleDeleteUser(user.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default AdminUsersPage;
