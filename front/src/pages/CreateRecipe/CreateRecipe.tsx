import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./createRecipe.css";
import { apiFetch } from "../../lib/apiClient";

export default function CreatRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [showThematicDropdown, setShowThematicDropdown] = useState(false);
const [thematicSearch, setThematicSearch] = useState("Entrée");

const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
const [categorySearch, setCategorySearch] = useState("Film");

const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
const [difficultySearch, setDifficultySearch] = useState("Facile");

const thematics = [
  { id: 1, name: "Entrée" },
  { id: 2, name: "Plat" },
  { id: 3, name: "Dessert" },
  { id: 4, name: "Boisson" },
];

const categories = [
  { id: 1, name: "Film" },
  { id: 2, name: "Série" },
  { id: 3, name: "Manga" },
  { id: 4, name: "Dessin Animé" },
];

const difficulties = [
  { value: "EASY", name: "Facile" },
  { value: "MEDIUM", name: "Moyen" },
  { value: "HARD", name: "Difficile" },
];

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<"EASY" | "MEDIUM" | "HARD">("EASY");

  const [selectedThematicId, setSelectedThematicId] = useState<number>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);

  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);

  const [works, setWorks] = useState<{ id: number; title: string }[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<number>(0);
  const [workSearch, setWorkSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [newWork, setNewWork] = useState({
    title: "",
    releaseYear: "",
    categoryId: 1,
  });
  const [showYearInput, setShowYearInput] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const filteredWorks = works.filter((w) =>
    w.title.toLowerCase().includes(workSearch.toLowerCase())
  );

  useEffect(() => {
    apiFetch("/api/works")
      .then((r) => r.json())
      .then((data) => setWorks(data));
  }, []);

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);

  const removeIngredient = () => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.slice(0, -1));
    } else {
      setIngredients([""]);
    }
  };

  const handleStepsChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addSteps = () => setSteps([...steps, ""]);

  const removeSteps = () => {
    if (steps.length > 1) {
      setSteps(steps.slice(0, -1));
    } else {
      setSteps([""]);
    }
  };

  const handleCreateWork = async () => {
    try {
      const formData = new FormData();

      formData.append("title", newWork.title);
      formData.append("releaseYear", "2024");
      formData.append("synopsis", description);
      formData.append("categoryId", String(selectedCategoryId));
      formData.append("thematics", JSON.stringify([selectedThematicId]));
      // réutilise l'image de la recette
      if (image) {
        formData.append("image", image);
      }

      const res = await apiFetch("/api/works", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const created = await res.json();

      setSelectedWorkId(created.id);
      setWorks((prev) => [...prev, created]);
      setWorkSearch(created.title);
      setShowSuggestions(false);

      return created.id;
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l’œuvre");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let workId = selectedWorkId;

      // si aucune œuvre sélectionnée → création auto
      if (!workId && workSearch.trim()) {
        setNewWork((prev) => ({
          ...prev,
          title: workSearch,
        }));

        const createdWorkId = await handleCreateWork();

        if (!createdWorkId) {
          throw new Error("Impossible de créer l’œuvre");
        }

        workId = createdWorkId;
      }

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("prepTime", String(Number(prepTime)));
      formData.append("cookTime", String(Number(prepTime)));
      formData.append("servings", "2");
      formData.append("difficulty", selectedDifficulty);
      formData.append("workId", String(workId));
      formData.append("categoryId", String(selectedCategoryId));
      formData.append(
        "steps",
        JSON.stringify(
          steps.map((content, idx) => ({
            order: idx + 1,
            content: content || "Étape sans description",
          }))
        )
      );

      formData.append(
        "recipeIngredients",
        JSON.stringify(
          ingredients.map(() => ({
            ingredientId: 1,
            quantity: 1,
            unit: "pièce(s)",
          }))
        )
      );

      formData.append(
        "thematics",
        JSON.stringify([selectedThematicId])
      );

      if (image) {
        formData.append("image", image);
      }

      const response = await apiFetch("/api/recipes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(
          err.message ||
            "Une erreur est survenue lors de l'enregistrement."
        );
      }

      const newRecipe = await response.json();

      alert(
        `Succès ! Votre recette "${newRecipe.title}" a été soumise pour validation.`
      );
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Impossible de joindre le serveur.");
    }
  };

  return (
    <section className="CreateRecipe">
      <form onSubmit={handleSubmit} className="CreatRecipe-form">
        <div className="Add-Header">
          <h2>Add your Recipe</h2>

          <div className="RecipeImg">
            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              <label>Image</label>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </div>
        </div>

        <div className="AddRecipeInfo">
          <div className="Recipe-name-input">
            <div className="Recipe-input-group">
              <label>Nom recette</label>

              <input
                type="text"
                placeholder="Titanesque"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div
              className="Recipe-input-group"
              style={{ position: "relative" }}
            >
              <label>Nom Oeuvre</label>

              <input
                type="text"
                placeholder="SNK"
                value={workSearch}
                onChange={(e) => {
                  setWorkSearch(e.target.value);
                  setSelectedWorkId(0);

                  setNewWork((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));

                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                required
              />

              {showSuggestions &&
                workSearch &&
                filteredWorks.length > 0 && (
                  <ul className="works-suggestions">
                    {filteredWorks.map((w) => (
                      <li
                        key={w.id}
                        onMouseDown={() => {
                          setSelectedWorkId(w.id);
                          setWorkSearch(w.title);
                          setShowSuggestions(false);
                          setShowYearInput(false); 
                        }}
                      >
                        {w.title}
                      </li>
                    ))}
                  </ul>
                )}

              {showSuggestions &&
                workSearch &&
                filteredWorks.length === 0 && (
                  
                  <div className="no-work-found">
                    <span>Aucune œuvre trouvée.</span>
                    <button
                    type="button"
                    onMouseDown={() => {
                      setNewWork((prev) => ({ ...prev, title: workSearch }));
                      setShowYearInput(true);
                      alert("L'œuvre sera créée automatiquement à l'envoi.");
                    }}
                  >
                    + Créer "{workSearch}"
                  </button>
                    
                  </div>
                  
                )}
                {showYearInput && (
                <input
                  type="number"
                  placeholder="2024"
                  value={newWork.releaseYear}
                  onMouseDown={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    setNewWork((prev) => ({ ...prev, releaseYear: e.target.value }))
                  }
                />
              )}
            </div>
          </div>

          <div className="Recipe-input-group">
            <label>Anecdote</label>

            <textarea
              placeholder="EREN kiff mikasa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="Difficulty-PrepaTime-Thematic">

          {/* Thématique */}
          <div className="dropdown-container thematic-field" style={{ position: "relative" }}>
            <label>Thématique</label>
            <button
              type="button"
              className="dropdown-btn"
              onClick={() => setShowThematicDropdown((prev) => !prev)}
              onBlur={() => setTimeout(() => setShowThematicDropdown(false), 150)}
            >
              {thematicSearch} <span>▼</span>
            </button>
            {showThematicDropdown && (
              <ul className="works-suggestions">
                {thematics.map((t) => (
                  <li
                    key={t.id}
                    onMouseDown={() => {
                      setSelectedThematicId(t.id);
                      setThematicSearch(t.name);
                      setShowThematicDropdown(false);
                    }}
                  >
                    {t.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Catégorie */}
          <div className="dropdown-container" style={{ position: "relative" }}>
            <label>Catégorie</label>
            <button
              type="button"
              className="dropdown-btn"
              onClick={() => setShowCategoryDropdown((prev) => !prev)}
              onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 150)}
            >
              {categorySearch} <span>▼</span>
            </button>
            {showCategoryDropdown && (
              <ul className="works-suggestions">
                {categories.map((c) => (
                  <li
                    key={c.id}
                    onMouseDown={() => {
                      setSelectedCategoryId(c.id);
                      setCategorySearch(c.name);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Difficulté */}
          <div className="dropdown-container" style={{ position: "relative" }}>
            <label>Difficulté</label>
            <button
              type="button"
              className="dropdown-btn"
              onClick={() => setShowDifficultyDropdown((prev) => !prev)}
              onBlur={() => setTimeout(() => setShowDifficultyDropdown(false), 150)}
            >
              {difficultySearch} <span>▼</span>
            </button>
            {showDifficultyDropdown && (
              <ul className="works-suggestions">
                {difficulties.map((d) => (
                  <li
                    key={d.value}
                    onMouseDown={() => {
                      setSelectedDifficulty(d.value as "EASY" | "MEDIUM" | "HARD");
                      setDifficultySearch(d.name);
                      setShowDifficultyDropdown(false);
                    }}
                  >
                    {d.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Durée */}
          <div className="Recipe-input-group">
            <label>Durée</label>
            <input
              type="text"
              placeholder="50min"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              required
            />
          </div>

        </div>

        <div className="ingredients-wrapper">
          <h2>Ingredients</h2>

          <div className="Container">
            {ingredients.map((ingredient, index) => (
              <input
                key={`ingredient-${index}`}
                type="text"
                placeholder={
                  index === 0 ? "Tomate" : "Autre ingrédient..."
                }
                value={ingredient}
                onChange={(e) =>
                  handleIngredientChange(index, e.target.value)
                }
                className="AddMore-Input"
              />
            ))}

            <div className="button-AddRemove-Container">
              <button
                type="button"
                onClick={addIngredient}
                className="AddMore-Button"
              >
                <span>Ajouter un ingrédient</span>
              </button>

              <button
                type="button"
                onClick={removeIngredient}
                className="AddMore-Button"
              >
                <span>Enlever un Ingrédient</span>
              </button>
            </div>
          </div>
        </div>

        <div className="steps-wrapper">
          <h2>Etapes</h2>

          <div className="Container">
            {steps.map((step, index) => (
              <input
                key={`step-${index}`}
                type="text"
                placeholder={
                  index === 0
                    ? "1- Capturer un titan"
                    : "Autre etape..."
                }
                value={step}
                onChange={(e) =>
                  handleStepsChange(index, e.target.value)
                }
                className="AddMore-Input"
              />
            ))}

            <div className="button-AddRemove-Container">
              <button
                type="button"
                onClick={addSteps}
                className="AddMore-Button"
              >
                <span>Ajouter une étape</span>
              </button>

              <button
                type="button"
                onClick={removeSteps}
                className="AddMore-Button"
              >
                <span>Enlever une Étape</span>
              </button>
            </div>
          </div>
        </div>

        <div className="Form-Footer">
          <label className="cgu-checkbox">
            <input type="checkbox" required />

            <span>
              En cochant cette case vous acceptez nos{" "}
              <NavLink to="/mentions-legales">
                conditions général
              </NavLink>
              .
            </span>
          </label>

          <button type="submit" className="Send-Button">
            Envoyer
          </button>
        </div>
      </form>
    </section>
  );
}