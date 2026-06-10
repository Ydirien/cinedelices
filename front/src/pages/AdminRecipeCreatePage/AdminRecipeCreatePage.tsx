import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminRecipeCreatePage.css';

type RecipeState = 'PENDING' | 'APPROVED' | 'REJECTED';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

type CurrentUser = {
  id: number;
  username?: string;
  email: string;
  role?: string;
};

type IngredientForm = {
  ingredientId: number;
  quantity: number;
  unit: string;
};

type StepForm = {
  order: number;
  content: string;
};

function AdminRecipeCreatePage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [prepTime, setPrepTime] = useState(10);
  const [cookTime, setCookTime] = useState(10);
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [state, setState] = useState<RecipeState>('APPROVED');
  const [workId, setWorkId] = useState(1);

  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    {
      ingredientId: 1,
      quantity: 1,
      unit: 'unité',
    },
  ]);

  const [steps, setSteps] = useState<StepForm[]>([
    {
      order: 1,
      content: '',
    },
  ]);

  const [thematics, setThematics] = useState<number[]>([1]);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3010/api';

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const token =
          localStorage.getItem('accessToken') ?? localStorage.getItem('token');

        if (!token) {
          return;
        }

        const response = await fetch(`${apiBaseUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        // Compatible avec les deux formats possibles :
        // { id, email, username } ou { user: { id, email, username } }
        setCurrentUser(data.user ?? data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCurrentUser();
  }, [apiBaseUrl]);

  function updateIngredient(
    index: number,
    field: keyof IngredientForm,
    value: string | number,
  ) {
    setIngredients((currentIngredients) => {
      const updatedIngredients = [...currentIngredients];

      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value,
      };

      return updatedIngredients;
    });
  }

  function addIngredient() {
    setIngredients((currentIngredients) => [
      ...currentIngredients,
      {
        ingredientId: 1,
        quantity: 1,
        unit: '',
      },
    ]);
  }

  function removeIngredient(index: number) {
    setIngredients((currentIngredients) =>
      currentIngredients.filter(
        (_, ingredientIndex) => ingredientIndex !== index,
      ),
    );
  }

  function updateStep(
    index: number,
    field: keyof StepForm,
    value: string | number,
  ) {
    setSteps((currentSteps) => {
      const updatedSteps = [...currentSteps];

      updatedSteps[index] = {
        ...updatedSteps[index],
        [field]: value,
      };

      return updatedSteps;
    });
  }

  function addStep() {
    setSteps((currentSteps) => [
      ...currentSteps,
      {
        order: currentSteps.length + 1,
        content: '',
      },
    ]);
  }

  function removeStep(index: number) {
    setSteps((currentSteps) =>
      currentSteps
        .filter((_, stepIndex) => stepIndex !== index)
        .map((step, stepIndex) => ({
          ...step,
          order: stepIndex + 1,
        })),
    );
  }

  function updateThematics(value: string) {
    const thematicIds = value
      .split(',')
      .map((thematicId) => Number(thematicId.trim()))
      .filter((thematicId) => Number.isInteger(thematicId) && thematicId > 0);

    setThematics(thematicIds);
  }

  async function handleCreateRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    const token =
      localStorage.getItem('accessToken') ?? localStorage.getItem('token');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${apiBaseUrl}/admin/recipes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title,
        description,
        image,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty,
        state,
        workId: Number(workId),

        steps: steps.map((step, index) => ({
          order: Number(step.order || index + 1),
          content: step.content,
        })),

        recipeIngredients: ingredients.map((ingredient) => ({
          ingredientId: Number(ingredient.ingredientId),
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit,
        })),

        thematics,
      }),
    });

    if (!response.ok) {
      setErrorMessage('Erreur lors de la création de la recette.');
      return;
    }

    const createdRecipe = await response.json();

    setSuccessMessage('Recette créée avec succès.');

    navigate(`/admin/recipes/${createdRecipe.id}`);
  }

  return (
    <main className="admin-recipe-create-page">
      <section className="admin-recipe-create-header">
        <div>
          <h1>Créer une recette</h1>
          <p>Ajoutez une nouvelle recette depuis l’espace administrateur.</p>
        </div>

        <Link to="/admin/recipes">Retour à la liste</Link>
      </section>

      {successMessage && (
        <p className="admin-success-message">{successMessage}</p>
      )}

      {errorMessage && <p className="admin-error-message">{errorMessage}</p>}

      <form className="admin-recipe-create-form" onSubmit={handleCreateRecipe}>
        <section className="admin-create-card">
          <h2>Informations principales</h2>

          <div className="admin-create-user-info">
            <strong>Créée par :</strong>{' '}
            {currentUser?.username ??
              currentUser?.email ??
              'Utilisateur connecté'}
          </div>

          <label>
            Titre
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>

          <label>
            Image URL
            <input
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              required
            />
          </label>

          <div className="admin-create-grid">
            <label>
              Préparation
              <input
                type="number"
                value={prepTime}
                onChange={(event) => setPrepTime(Number(event.target.value))}
                required
              />
            </label>

            <label>
              Cuisson
              <input
                type="number"
                value={cookTime}
                onChange={(event) => setCookTime(Number(event.target.value))}
                required
              />
            </label>

            <label>
              Portions
              <input
                type="number"
                value={servings}
                onChange={(event) => setServings(Number(event.target.value))}
                required
              />
            </label>
          </div>

          <div className="admin-create-grid">
            <label>
              Difficulté
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value as Difficulty)
                }
              >
                <option value="EASY">Facile</option>
                <option value="MEDIUM">Moyen</option>
                <option value="HARD">Difficile</option>
              </select>
            </label>

            <label>
              Statut
              <select
                value={state}
                onChange={(event) =>
                  setState(event.target.value as RecipeState)
                }
              >
                <option value="APPROVED">Validée</option>
                <option value="PENDING">En attente</option>
                <option value="REJECTED">Refusée</option>
              </select>
            </label>

            <label>
              ID œuvre
              <input
                type="number"
                value={workId}
                onChange={(event) => setWorkId(Number(event.target.value))}
                required
              />
            </label>
          </div>
        </section>

        <section className="admin-create-card">
          <div className="admin-create-card-header">
            <h2>Ingrédients</h2>

            <button type="button" onClick={addIngredient}>
              Ajouter
            </button>
          </div>

          <div className="admin-create-list">
            {ingredients.map((ingredient, index) => (
              <div
                key={`${ingredient.ingredientId}-${index}`}
                className="admin-create-row"
              >
                <label>
                  ID ingrédient
                  <input
                    type="number"
                    value={ingredient.ingredientId}
                    onChange={(event) =>
                      updateIngredient(
                        index,
                        'ingredientId',
                        Number(event.target.value),
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Quantité
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(event) =>
                      updateIngredient(
                        index,
                        'quantity',
                        Number(event.target.value),
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Unité
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(event) =>
                      updateIngredient(index, 'unit', event.target.value)
                    }
                    required
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
        </section>

        <section className="admin-create-card">
          <div className="admin-create-card-header">
            <h2>Étapes</h2>

            <button type="button" onClick={addStep}>
              Ajouter
            </button>
          </div>

          <div className="admin-create-list">
            {steps.map((step, index) => (
              <div
                key={`${step.order}-${index}`}
                className="admin-create-step-row"
              >
                <label>
                  Ordre
                  <input
                    type="number"
                    value={step.order}
                    onChange={(event) =>
                      updateStep(index, 'order', Number(event.target.value))
                    }
                    required
                  />
                </label>

                <label>
                  Contenu
                  <textarea
                    value={step.content}
                    onChange={(event) =>
                      updateStep(index, 'content', event.target.value)
                    }
                    required
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
        </section>

        <section className="admin-create-card">
          <h2>Thématiques</h2>

          <label>
            IDs des thématiques séparés par des virgules
            <input
              type="text"
              value={thematics.join(', ')}
              onChange={(event) => updateThematics(event.target.value)}
              placeholder="Exemple : 1, 2, 3"
              required
            />
          </label>
        </section>

        <div className="admin-create-submit">
          <button type="submit">Créer la recette</button>
        </div>
      </form>
    </main>
  );
}

export default AdminRecipeCreatePage;