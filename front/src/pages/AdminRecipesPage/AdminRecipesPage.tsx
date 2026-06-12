import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination/Pagination';
import './AdminRecipesPage.css';
import { apiFetch } from '../../lib/apiClient';

const LIMIT = 10;

// Je définis les différents statuts possibles pour une recette
type RecipeState = 'PENDING' | 'APPROVED' | 'REJECTED';

// Je définis les niveaux de difficulté possibles
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

// Je définis le type d'une recette récupérée côté admin
// Cela permet à TypeScript de savoir quelles propriétés sont disponibles
type AdminRecipe = {
  id: number;
  title: string;
  image?: string;
  state: RecipeState;
  difficulty: Difficulty;
  createdAt?: string;
  user?: {
    id: number;
    username?: string;
    email: string;
  };
  work?: {
    title: string;
    category?: {
      name: string;
    };
  };
};

// Je définis le format de réponse envoyé par l'API
// Ici, les recettes sont dans data avec des infos de pagination
type AdminRecipesResponse = {
  data: AdminRecipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function AdminRecipesPage() {
  // Je stocke ici la liste des recettes récupérées depuis le back
  const [recipes, setRecipes] = useState<AdminRecipe[]>([]);

  // Je gère l'état de chargement pour afficher un message pendant le fetch
  const [isLoading, setIsLoading] = useState(true);

  // Je stocke ici un éventuel message d'erreur
  const [errorMessage, setErrorMessage] = useState('');

  // Pagination : page courante et nombre total de pages renvoyé par l'API
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchRecipes(page: number) {
    try {
      setIsLoading(true);

      const response = await apiFetch(
        `/api/admin/recipes?page=${page}&limit=${LIMIT}`,
      );

      // Si la réponse n'est pas correcte, je déclenche une erreur
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des recettes');
      }

      const data: AdminRecipesResponse = await response.json();

      // Je mets à jour le state avec les recettes reçues et les infos de pagination
      setRecipes(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage('Impossible de charger les recettes.');
    } finally {
      // Dans tous les cas, j'arrête le chargement
      setIsLoading(false);
    }
  }

  // Au chargement de la page (et à chaque changement de page), je récupère les recettes
  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  // Change de page et remonte en haut du tableau
  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  // Fonction qui permet de supprimer une recette
  async function handleDeleteRecipe(id: number) {
    const confirmDelete = window.confirm('Supprimer cette recette ?');

    // Si l'utilisateur annule, on arrête la fonction
    if (!confirmDelete) {
      return;
    }

    const response = await apiFetch(`/api/admin/recipes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setErrorMessage('Erreur lors de la suppression de la recette.');
      return;
    }

    // Je recharge la page courante pour garder la pagination cohérente
    // (ex: dernier élément d'une page supprimé -> totalPages change)
    fetchRecipes(currentPage);
  }

  // Fonction qui permet de valider une recette depuis la liste admin
  async function handleApproveRecipe(id: number) {
    const response = await apiFetch(`/api/admin/recipes/${id}/state`, {
      method: 'PATCH',
      body: JSON.stringify({ state: 'APPROVED' }),
    });

    if (!response.ok) {
      setErrorMessage('Erreur lors de la validation de la recette.');
      return;
    }

    // Une fois validée, je mets à jour le statut directement dans le state
    // Comme ça, le tableau se met à jour sans recharger la page
    setRecipes((currentRecipes) =>
      currentRecipes.map((recipe) =>
        recipe.id === id
          ? {
              ...recipe,
              state: 'APPROVED',
            }
          : recipe,
      ),
    );
  }

  // Pendant le chargement, j'affiche un message simple
  if (isLoading) {
    return <p className="admin-recipes-message">Chargement des recettes...</p>;
  }

  // Si une erreur existe, je l'affiche à la place de la page
  if (errorMessage) {
    return <p className="admin-recipes-message">{errorMessage}</p>;
  }

  return (
    <main className="admin-recipes-page">
      <section className="admin-recipes-header">
        <div>
          <h1>Gestion des recettes</h1>
          <p>
            Consultez, validez, modifiez ou supprimez les recettes du projet.
          </p>
        </div>

        <div className="admin-recipes-header-actions">
          <Link to="/admin/dashboard">Retour au dashboard</Link>
          <Link to="/admin/recipes/new">Créer une recette</Link>
        </div>
      </section>

      <section className="admin-recipes-table-container">
        <table className="admin-recipes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Recette</th>
              <th>Œuvre</th>
              <th>Catégorie</th>
              <th>Auteur</th>
              <th>Statut</th>
              <th>Difficulté</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan={8}>Aucune recette trouvée.</td>
              </tr>
            ) : (
              recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.id}</td>

                  <td>{recipe.title}</td>

                  <td>{recipe.work?.title ?? 'Non renseignée'}</td>

                  <td>{recipe.work?.category?.name ?? 'Non renseignée'}</td>

                  <td>
                    {recipe.user?.username ??
                      recipe.user?.email ??
                      'Utilisateur inconnu'}
                  </td>

                  <td>
                    <span className={`recipe-state ${recipe.state.toLowerCase()}`}>
                      {recipe.state}
                    </span>
                  </td>

                  <td>{recipe.difficulty}</td>

                  <td className="admin-recipes-actions">
                    <Link to={`/admin/recipes/${recipe.id}`}>
                      Voir / modifier
                    </Link>

                    <button
                      type="button"
                      className="validate-button"
                      onClick={() => handleApproveRecipe(recipe.id)}
                      disabled={recipe.state === 'APPROVED'}
                    >
                      {recipe.state === 'APPROVED' ? 'Déjà validée' : 'Valider'}
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}

export default AdminRecipesPage;