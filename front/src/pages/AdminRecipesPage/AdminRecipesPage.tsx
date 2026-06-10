import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminRecipesPage.css';

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

  // Je récupère l'URL de base de l'API depuis le fichier .env
  // Si elle n'existe pas, j'utilise l'URL locale par défaut
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3010/api';

  // Fonction qui va chercher toutes les recettes côté admin
  async function fetchRecipes() {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/recipes`);

      // Si la réponse n'est pas correcte, je déclenche une erreur
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des recettes');
      }

      const data: AdminRecipesResponse = await response.json();

      // Je mets à jour le state avec les recettes reçues
      setRecipes(data.data);
    } catch (error) {
      setErrorMessage('Impossible de charger les recettes.');
    } finally {
      // Dans tous les cas, j'arrête le chargement
      setIsLoading(false);
    }
  }

  // Au chargement de la page, je récupère automatiquement les recettes
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fonction qui permet de supprimer une recette
  async function handleDeleteRecipe(id: number) {
    const confirmDelete = window.confirm('Supprimer cette recette ?');

    // Si l'utilisateur annule, on arrête la fonction
    if (!confirmDelete) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/admin/recipes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setErrorMessage('Erreur lors de la suppression de la recette.');
      return;
    }

    // Je retire directement la recette supprimée de l'affichage
    // Cela évite de devoir recharger toute la page
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.id !== id),
    );
  }

  // Fonction qui permet de valider une recette depuis la liste admin
  async function handleApproveRecipe(id: number) {
    const response = await fetch(`${apiBaseUrl}/admin/recipes/${id}/state`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: 'APPROVED',
      }),
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
    </main>
  );
}

export default AdminRecipesPage;