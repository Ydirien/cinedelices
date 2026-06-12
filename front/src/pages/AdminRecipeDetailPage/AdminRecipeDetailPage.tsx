import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './AdminRecipeDetailPage.css';
import { apiFetch } from '../../lib/apiClient';

type RecipeState = 'PENDING' | 'APPROVED' | 'REJECTED';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

type AdminRecipeIngredient = {
  id?: number;
  ingredientId?: number;
  quantity: number;
  unit: string;
  ingredient?: {
    id: number;
    name: string;
  };
};

type AdminRecipeStep = {
  id?: number;
  order: number;
  content: string;
};

type AdminRecipeDetail = {
  id: number;
  title: string;
  description: string;
  image?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: Difficulty;
  state: RecipeState;
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
  steps?: AdminRecipeStep[];
  recipeIngredients?: AdminRecipeIngredient[];
};

function AdminRecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<AdminRecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successPopupMessage, setSuccessPopupMessage] = useState('');

  const [openedSections, setOpenedSections] = useState({
    informations: true,
    ingredients: true,
    steps: true,
    state: true,
  });

  async function fetchRecipe() {
    try {
      const response = await apiFetch(`/api/admin/recipes/${id}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la recette');
      }

      const data: AdminRecipeDetail = await response.json();

      setRecipe(data);
    } catch (error) {
      setErrorMessage('Impossible de charger cette recette.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (!successPopupMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessPopupMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [successPopupMessage]);

  function toggleSection(section: keyof typeof openedSections) {
    setOpenedSections((currentSections) => ({
      ...currentSections,
      [section]: !currentSections[section],
    }));
  }

  function updateRecipeField(
    field: keyof AdminRecipeDetail,
    value: string | number | Difficulty | RecipeState,
  ) {
    setRecipe((currentRecipe) => {
      if (!currentRecipe) {
        return currentRecipe;
      }

      return {
        ...currentRecipe,
        [field]: value,
      };
    });
  }

  function updateIngredient(
    index: number,
    field: 'ingredientId' | 'quantity' | 'unit',
    value: string | number,
  ) {
    setRecipe((currentRecipe) => {
      if (!currentRecipe) {
        return currentRecipe;
      }

      const updatedIngredients = [...(currentRecipe.recipeIngredients ?? [])];

      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value,
      };

      return {
        ...currentRecipe,
        recipeIngredients: updatedIngredients,
      };
    });
  }

  function addIngredient() {
    setRecipe((currentRecipe) => {
      if (!currentRecipe) {
        return currentRecipe;
      }

      return {
        ...currentRecipe,
        recipeIngredients: [
          ...(currentRecipe.recipeIngredients ?? []),
          {
            ingredientId: 1,
            quantity: 1,
            unit: '',
            ingredient: {
              id: 1,
              name: 'Nouvel ingrédient',
            },
          },
        ],
      };
    });
  }

  function removeIngredient(index: number) {
    setRecipe((currentRecipe) => {
      if (!currentRecipe) {
        return currentRecipe;
      }

      const updatedIngredients = [...(currentRecipe.recipeIngredients ?? [])];

      updatedIngredients.splice(index, 1);

      return {
        ...currentRecipe,
        recipeIngredients: updatedIngredients,
      };
    });
  }

  function updateStep(
    index: number,
    field: 'order' | 'content',
    value: string | number,
  ) {
    setRecipe((currentRecipe) => {
      if (!currentRecipe) {
        return currentRecipe;
      }

      const updatedSteps = [...(currentRecipe.steps ?? [])];

      updatedSteps[index] = {
        ...updatedSteps[index],
        [field]: value,
      };

      return {
        ...currentRecipe,
        steps: updatedSteps,
      };
    });
  }

  function addStep() {
    setRecipe((currentRecipe) => {
      if (!currentRecipe) {
        return currentRecipe;
      }

      const currentSteps = currentRecipe.steps ?? [];

      return {
        ...currentRecipe,
        steps: [
          ...currentSteps,
          {
            order: currentSteps.length + 1,
            content: '',
          },
        ],
      };
    });
  }

  function removeStep(index: number) {
    setRecipe((currentRecipe) => {
      if (!currentRecipe) {
        return currentRecipe;
      }

      const updatedSteps = [...(currentRecipe.steps ?? [])];

      updatedSteps.splice(index, 1);

      const reorderedSteps = updatedSteps.map((step, stepIndex) => ({
        ...step,
        order: stepIndex + 1,
      }));

      return {
        ...currentRecipe,
        steps: reorderedSteps,
      };
    });
  }

  async function handleSaveRecipe() {
    if (!recipe) {
      return;
    }

    const recipeIngredientsPayload =
      recipe.recipeIngredients?.map((item) => ({
        ingredientId: Number(item.ingredientId ?? item.ingredient?.id),
        quantity: Number(item.quantity),
        unit: item.unit,
      })) ?? [];

    const stepsPayload =
      recipe.steps?.map((step, index) => ({
        order: Number(step.order || index + 1),
        content: step.content,
      })) ?? [];

    const response = await apiFetch(`/api/admin/recipes/${recipe.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: recipe.title,
        description: recipe.description,
        prepTime: Number(recipe.prepTime),
        cookTime: Number(recipe.cookTime),
        servings: Number(recipe.servings),
        difficulty: recipe.difficulty,
        recipeIngredients: recipeIngredientsPayload,
        steps: stepsPayload,
      }),
    });

    if (!response.ok) {
      setSuccessPopupMessage('');
      setErrorMessage('Erreur lors de la modification de la recette.');
      return;
    }

    await fetchRecipe();

    setErrorMessage('');
    setSuccessPopupMessage('Recette modifiée avec succès.');
  }

  async function handleUpdateState(newState: RecipeState) {
    if (!recipe) {
      return;
    }

    const response = await apiFetch(`/api/admin/recipes/${recipe.id}/state`, {
      method: 'PATCH',
      body: JSON.stringify({ state: newState }),
    });

    if (!response.ok) {
      setSuccessPopupMessage('');
      setErrorMessage('Erreur lors de la mise à jour du statut.');
      return;
    }

    const updatedRecipe = await response.json();

    setRecipe((currentRecipe) => {
      if (!currentRecipe) {
        return currentRecipe;
      }

      return {
        ...currentRecipe,
        state: updatedRecipe.state,
      };
    });

    setErrorMessage('');
    setSuccessPopupMessage('Statut mis à jour avec succès.');
  }

  async function handleDeleteRecipe() {
    if (!recipe) {
      return;
    }

    const confirmDelete = window.confirm(
      'Supprimer définitivement cette recette ?',
    );

    if (!confirmDelete) {
      return;
    }

    const response = await apiFetch(`/api/admin/recipes/${recipe.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setSuccessPopupMessage('');
      setErrorMessage('Erreur lors de la suppression de la recette.');
      return;
    }

    navigate('/admin/recipes');
  }

  if (isLoading) {
    return (
      <p className="admin-recipe-detail-message">
        Chargement de la recette...
      </p>
    );
  }

  if (errorMessage && !recipe) {
    return <p className="admin-recipe-detail-message">{errorMessage}</p>;
  }

  if (!recipe) {
    return (
      <p className="admin-recipe-detail-message">Recette introuvable.</p>
    );
  }

  return (
    <main className="admin-recipe-detail-page">
      {successPopupMessage && (
        <div className="admin-success-popup">
          <span className="admin-success-popup-icon">✓</span>
          <p>{successPopupMessage}</p>
        </div>
      )}

      <section className="admin-recipe-detail-header">
        <h1>Gestion de la recette</h1>

        <Link to="/admin/recipes">Retour à la liste</Link>
      </section>

      {errorMessage && <p className="admin-error-message">{errorMessage}</p>}

      <section className="admin-recipe-detail-layout">
        <article className="admin-recipe-preview">
          {recipe.image && <img src={recipe.image} alt={recipe.title} />}

          <h2>{recipe.title}</h2>

          <p>
            <strong>Statut :</strong> {recipe.state}
          </p>

          <p>
            <strong>Auteur :</strong>{' '}
            {recipe.user?.username ??
              recipe.user?.email ??
              'Utilisateur inconnu'}
          </p>

          <p>
            <strong>Œuvre :</strong> {recipe.work?.title ?? 'Non renseignée'}
          </p>

          <p>
            <strong>Catégorie :</strong>{' '}
            {recipe.work?.category?.name ?? 'Non renseignée'}
          </p>
        </article>

        <article className="admin-recipe-form-card">
          <button
            type="button"
            className="admin-collapsible-header"
            onClick={() => toggleSection('informations')}
          >
            <span>Modifier les informations</span>

            <span
              className={`admin-collapsible-arrow ${
                openedSections.informations ? 'is-open' : ''
              }`}
            >
              ▼
            </span>
          </button>

          <div
            className={`admin-collapsible-content ${
              openedSections.informations ? 'is-open' : 'is-closed'
            }`}
            aria-hidden={!openedSections.informations}
          >
            <label>
              Titre
              <input
                type="text"
                value={recipe.title}
                onChange={(event) =>
                  updateRecipeField('title', event.target.value)
                }
              />
            </label>

            <label>
              Description
              <textarea
                value={recipe.description}
                onChange={(event) =>
                  updateRecipeField('description', event.target.value)
                }
              />
            </label>

            <div className="admin-recipe-form-grid">
              <label>
                Préparation
                <input
                  type="number"
                  value={recipe.prepTime}
                  onChange={(event) =>
                    updateRecipeField('prepTime', Number(event.target.value))
                  }
                />
              </label>

              <label>
                Cuisson
                <input
                  type="number"
                  value={recipe.cookTime}
                  onChange={(event) =>
                    updateRecipeField('cookTime', Number(event.target.value))
                  }
                />
              </label>

              <label>
                Portions
                <input
                  type="number"
                  value={recipe.servings}
                  onChange={(event) =>
                    updateRecipeField('servings', Number(event.target.value))
                  }
                />
              </label>
            </div>

            <label>
              Difficulté
              <select
                value={recipe.difficulty}
                onChange={(event) =>
                  updateRecipeField(
                    'difficulty',
                    event.target.value as Difficulty,
                  )
                }
              >
                <option value="EASY">Facile</option>
                <option value="MEDIUM">Moyen</option>
                <option value="HARD">Difficile</option>
              </select>
            </label>

            <button type="button" onClick={handleSaveRecipe}>
              Enregistrer les modifications
            </button>
          </div>
        </article>
      </section>

      <section className="admin-recipe-extra-section">
        <article className="admin-recipe-extra-card">
          <button
            type="button"
            className="admin-collapsible-header"
            onClick={() => toggleSection('ingredients')}
          >
            <span>Ingrédients</span>

            <span
              className={`admin-collapsible-arrow ${
                openedSections.ingredients ? 'is-open' : ''
              }`}
            >
              ▼
            </span>
          </button>

          <div
            className={`admin-collapsible-content ${
              openedSections.ingredients ? 'is-open' : 'is-closed'
            }`}
            aria-hidden={!openedSections.ingredients}
          >
            <button type="button" onClick={addIngredient}>
              Ajouter un ingrédient
            </button>

            {recipe.recipeIngredients && recipe.recipeIngredients.length > 0 ? (
              <div className="admin-ingredients-edit-list">
                {recipe.recipeIngredients.map((item, index) => (
                  <div
                    key={item.id ?? `${item.ingredientId}-${index}`}
                    className="admin-ingredient-edit-row"
                  >
                    <label>
                      Ingrédient
                      <input
                        type="text"
                        value={item.ingredient?.name ?? 'Ingrédient'}
                        disabled
                      />
                    </label>

                    <label>
                      Quantité
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(event) =>
                          updateIngredient(
                            index,
                            'quantity',
                            Number(event.target.value),
                          )
                        }
                      />
                    </label>

                    <label>
                      Unité
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(event) =>
                          updateIngredient(index, 'unit', event.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => removeIngredient(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun ingrédient renseigné.</p>
            )}
          </div>
        </article>

        <article className="admin-recipe-extra-card">
          <button
            type="button"
            className="admin-collapsible-header"
            onClick={() => toggleSection('steps')}
          >
            <span>Étapes</span>

            <span
              className={`admin-collapsible-arrow ${
                openedSections.steps ? 'is-open' : ''
              }`}
            >
              ▼
            </span>
          </button>

          <div
            className={`admin-collapsible-content ${
              openedSections.steps ? 'is-open' : 'is-closed'
            }`}
            aria-hidden={!openedSections.steps}
          >
            <button type="button" onClick={addStep}>
              Ajouter une étape
            </button>

            {recipe.steps && recipe.steps.length > 0 ? (
              <div className="admin-steps-edit-list">
                {recipe.steps.map((step, index) => (
                  <div
                    key={step.id ?? `${step.order}-${index}`}
                    className="admin-step-edit-row"
                  >
                    <label>
                      Ordre
                      <input
                        type="number"
                        value={step.order}
                        onChange={(event) =>
                          updateStep(
                            index,
                            'order',
                            Number(event.target.value),
                          )
                        }
                      />
                    </label>

                    <label>
                      Contenu
                      <textarea
                        value={step.content}
                        onChange={(event) =>
                          updateStep(index, 'content', event.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => removeStep(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucune étape renseignée.</p>
            )}
          </div>
        </article>
      </section>

      <section className="admin-recipe-state-card">
        <button
          type="button"
          className="admin-collapsible-header"
          onClick={() => toggleSection('state')}
        >
          <span>Gestion du statut</span>

          <span
            className={`admin-collapsible-arrow ${
              openedSections.state ? 'is-open' : ''
            }`}
          >
            ▼
          </span>
        </button>

        <div
          className={`admin-collapsible-content ${
            openedSections.state ? 'is-open' : 'is-closed'
          }`}
          aria-hidden={!openedSections.state}
        >
          <div className="admin-recipe-state-actions">
            <button type="button" onClick={() => handleUpdateState('APPROVED')}>
              Valider
            </button>

            <button type="button" onClick={() => handleUpdateState('PENDING')}>
              Remettre en attente
            </button>

            <button type="button" onClick={() => handleUpdateState('REJECTED')}>
              Refuser
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={handleDeleteRecipe}
            >
              Supprimer la recette
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminRecipeDetailPage;