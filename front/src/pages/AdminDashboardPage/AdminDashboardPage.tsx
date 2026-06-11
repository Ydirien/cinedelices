import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css';

type AdminStats = {
  totalRecipes: number;
  approvedRecipes: number;
  pendingRecipes: number;
  totalUsers: number;
  totalCategories: number;
};

type PendingRecipe = {
  id: number;
  title: string;
  createdAt?: string;
  user?: {
    id: number;
    email: string;
  };
  work?: {
    title: string;
    category?: {
      name: string;
    };
  };
};

type DashboardData = {
  stats: AdminStats;
  latestPendingRecipes: PendingRecipe[];
};

function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3010/api';

  function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken') ?? localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function fetchDashboard() {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/dashboard`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du dashboard');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      setErrorMessage('Impossible de charger le tableau de bord administrateur.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function handleApproveRecipe(id: number) {
    await fetch(`${apiBaseUrl}/admin/recipes/${id}/state`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        state: 'APPROVED',
      }),
    });

    fetchDashboard();
  }

  async function handleDeleteRecipe(id: number) {
    const confirmDelete = window.confirm('Supprimer cette recette ?');

    if (!confirmDelete) {
      return;
    }

    await fetch(`${apiBaseUrl}/admin/recipes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    fetchDashboard();
  }

  if (isLoading) {
    return <p>Chargement du tableau de bord...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!dashboardData) {
    return <p>Aucune donnée disponible.</p>;
  }

  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-header">
        <div>
          <h1>Tableau de bord administrateur</h1>
          <p>Gestion des recettes, validations et statistiques du projet.</p>
        </div>
      </section>

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <span>{dashboardData.stats.totalRecipes}</span>
          <p>Recettes au total</p>
        </article>

        <article className="admin-stat-card">
          <span>{dashboardData.stats.approvedRecipes}</span>
          <p>Recettes validées</p>
        </article>

        <article className="admin-stat-card">
          <span>{dashboardData.stats.pendingRecipes}</span>
          <p>En attente</p>
        </article>

        <article className="admin-stat-card">
          <span>{dashboardData.stats.totalUsers}</span>
          <p>Utilisateurs</p>
        </article>

        <article className="admin-stat-card">
          <span>{dashboardData.stats.totalCategories}</span>
          <p>Catégories</p>
        </article>
      </section>

      <section className="admin-dashboard-actions">
        <Link to="/admin/recipes/new">Créer une recette</Link>
        <Link to="/admin/recipes">Gérer toutes les recettes</Link>
        <Link to="/profil">Voir mon Profil</Link>
      </section>

      <section className="admin-pending-section">
        <h2>Recettes en attente de validation</h2>

        {dashboardData.latestPendingRecipes.length === 0 ? (
          <p>Aucune recette en attente pour le moment.</p>
        ) : (
          <div className="admin-pending-list">
            {dashboardData.latestPendingRecipes.map((recipe) => (
              <article key={recipe.id} className="admin-pending-card">
                <div>
                  <h3>{recipe.title}</h3>

                  <p>
                    Proposée par : {recipe.user?.email ?? 'Utilisateur inconnu'}
                  </p>

                  <p>
                    Œuvre : {recipe.work?.title ?? 'Non renseignée'}
                  </p>

                  <p>
                    Catégorie : {recipe.work?.category?.name ?? 'Non renseignée'}
                  </p>
                </div>

                <div className="admin-pending-actions">
                  <Link
                    to={`/admin/recipes/${recipe.id}`}
                    className="view-button"
                  >
                    Voir
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleApproveRecipe(recipe.id)}
                  >
                    Valider
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboardPage;