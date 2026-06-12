import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./createRecipe.css";
import { apiFetch } from "../../lib/apiClient";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");

  const [showThematicDropdown, setShowThematicDropdown] = useState(false);
  const [thematicSearch, setThematicSearch] = useState("Entrée");

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("Film");

  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [difficultySearch, setDifficultySearch] = useState("Facile");

  const [showUnitDropdowns, setShowUnitDropdowns] = useState<boolean[]>([false]);
  const units = ["g", "kg", "ml", "L", "cl", "pièce(s)", "c. à soupe", "c. à café", "pincée"];

  const [servings, setServings] = useState<string>("2");

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

  const [selectedDifficulty, setSelectedDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [selectedThematicId, setSelectedThematicId] = useState<number>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);

  // ── Works ──────────────────────────────────────────────────────────────────
  const [works, setWorks] = useState<{ id: number; title: string }[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<number>(0);
  const [workSearch, setWorkSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newWork, setNewWork] = useState({ title: "", releaseYear: "", categoryId: 1 });
  const [showYearInput, setShowYearInput] = useState(false);

  const filteredWorks = works.filter((w) =>
    w.title.toLowerCase().includes(workSearch.toLowerCase())
  );

  useEffect(() => {
    apiFetch("/api/works")
      .then((r) => r.json())
      .then((data) => setWorks(data));
  }, []);

  // ── Ingredients ────────────────────────────────────────────────────────────
  const [allIngredients, setAllIngredients] = useState<{ id: number; name: string }[]>([]);

  const [ingredientObjects, setIngredientObjects] = useState<
    { ingredientId: number; quantity: string; unit: string }[]
  >([{ ingredientId: 0, quantity: "", unit: "pièce(s)" }]);

  const [ingredientSearches, setIngredientSearches] = useState<string[]>([""]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState<{ id: number; name: string }[][]>([[]]);
  const [showIngredientSuggestions, setShowIngredientSuggestions] = useState<boolean[]>([false]);

  useEffect(() => {
    apiFetch("/api/ingredients")
      .then((r) => r.json())
      .then((data) => setAllIngredients(data));
  }, []);

 const handleIngredientSearch = (index: number, value: string) => {
  const newSearches = [...ingredientSearches];
  newSearches[index] = value;
  setIngredientSearches(newSearches);

  const newObjects = [...ingredientObjects];
  newObjects[index] = { ...newObjects[index], ingredientId: 0 };
  setIngredientObjects(newObjects);

  const filtered =
    value.length === 0
      ? allIngredients
      : allIngredients.filter((ing) =>
          ing.name.toLowerCase().includes(value.toLowerCase())
        );

  const newSuggestions = [...ingredientSuggestions];
  newSuggestions[index] = filtered;
  setIngredientSuggestions(newSuggestions);

  const newShow = [...showIngredientSuggestions];
  newShow[index] = true; // ✅ toujours afficher
  setShowIngredientSuggestions(newShow);
};

  const selectIngredient = (index: number, ingredient: { id: number; name: string }) => {
    const newSearches = [...ingredientSearches];
    newSearches[index] = ingredient.name;
    setIngredientSearches(newSearches);

    const newObjects = [...ingredientObjects];
    newObjects[index] = { ...newObjects[index], ingredientId: ingredient.id };
    setIngredientObjects(newObjects);

    const newShow = [...showIngredientSuggestions];
    newShow[index] = false;
    setShowIngredientSuggestions(newShow);
  };

  const createIngredientIfNeeded = async (name: string): Promise<number | null> => {
    const res = await apiFetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return null;
    const created = await res.json();
    return created.id;
  };

  const addIngredient = () => {
    setIngredientObjects([...ingredientObjects, { ingredientId: 0, quantity: "", unit: "pièce(s)" }]);
    setIngredientSearches([...ingredientSearches, ""]);
    setIngredientSuggestions([...ingredientSuggestions, []]);
    setShowIngredientSuggestions([...showIngredientSuggestions, false]);
    setShowUnitDropdowns([...showUnitDropdowns, false]); // ← ajouter
  };

  const removeIngredient = () => {
    if (ingredientObjects.length > 1) {
      setIngredientObjects(ingredientObjects.slice(0, -1));
      setIngredientSearches(ingredientSearches.slice(0, -1));
      setIngredientSuggestions(ingredientSuggestions.slice(0, -1));
      setShowIngredientSuggestions(showIngredientSuggestions.slice(0, -1));
      setShowUnitDropdowns(showUnitDropdowns.slice(0, -1)); // ← ajouter
    } else {
      setIngredientObjects([{ ingredientId: 0, quantity: "", unit: "pièce(s)" }]);
      setIngredientSearches([""]);
      setIngredientSuggestions([[]]);
      setShowIngredientSuggestions([false]);
      setShowUnitDropdowns([false]); // ← ajouter
    }
  };

  // ── Steps ──────────────────────────────────────────────────────────────────
  const [steps, setSteps] = useState<string[]>([""]);

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

  // ── Image ──────────────────────────────────────────────────────────────────
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ── Works handlers ─────────────────────────────────────────────────────────
  const handleCreateWork = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newWork.title);
      formData.append("releaseYear", "2024");
      formData.append("synopsis", description);
      formData.append("categoryId", String(selectedCategoryId));
      formData.append("thematics", JSON.stringify([selectedThematicId]));
      if (image) formData.append("image", image);

      const res = await apiFetch("/api/works", { method: "POST", body: formData });

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
      alert("Erreur lors de la création de l'œuvre");
      return null;
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let workId = selectedWorkId;

      if (!workId && workSearch.trim()) {
        setNewWork((prev) => ({ ...prev, title: workSearch }));
        const createdWorkId = await handleCreateWork();
        if (!createdWorkId) throw new Error("Impossible de créer l'œuvre");
        workId = createdWorkId;
      }

      // Résout les ingrédients : crée ceux sans id
      const resolvedIngredients = await Promise.all(
        ingredientObjects.map(async (ing, i) => {
          let id = ing.ingredientId;
          if (!id && ingredientSearches[i].trim()) {
            const created = await createIngredientIfNeeded(ingredientSearches[i]);
            if (created) {
              setAllIngredients((prev) => [...prev, { id: created, name: ingredientSearches[i] }]);
              id = created;
            } else {
              id = 1; // fallback
            }
          }
          return {
            ingredientId: id,
            quantity: Number(ing.quantity) || 1,
            unit: ing.unit,
          };
        })
      );

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("prepTime", String(Number(prepTime)));
      formData.append("cookTime", String(Number(cookTime)));
      formData.append("servings", String(Number(servings) || 2));
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
      formData.append("recipeIngredients", JSON.stringify(resolvedIngredients));
      formData.append("thematics", JSON.stringify([selectedThematicId]));
      if (image) formData.append("image", image);

      const response = await apiFetch("/api/recipes", { method: "POST", body: formData });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Une erreur est survenue lors de l'enregistrement.");
      }

      const newRecipe = await response.json();
      alert(`Succès ! Votre recette "${newRecipe.title}" a été soumise pour validation.`);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Impossible de joindre le serveur.");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="CreateRecipe">
      <form onSubmit={handleSubmit} className="CreatRecipe-form">

        {/* Header */}
        <div className="Add-Header">
          <h2>Ajoute ta recette</h2>
          <div className="RecipeImg">
            {preview ? <img src={preview} alt="preview" /> : <label>Image</label>}
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

        {/* Infos principales */}
        <div className="AddRecipeInfo">
          <div className="Recipe-name-input">

            {/* Nom recette */}
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

            {/* Nom oeuvre */}
            <div className="Recipe-input-group" style={{ position: "relative" }}>
              <label>Nom Oeuvre</label>
              <input
                type="text"
                placeholder="SNK"
                value={workSearch}
                onChange={(e) => {
                  setWorkSearch(e.target.value);
                  setSelectedWorkId(0);
                  setNewWork((prev) => ({ ...prev, title: e.target.value }));
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                required
              />

              {showSuggestions && workSearch && filteredWorks.length > 0 && (
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

              {showSuggestions && workSearch && filteredWorks.length === 0 && (
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

          {/* Anecdote */}
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

        {/* Dropdowns + durées */}
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

          {/* Préparation */}
          <div className="Recipe-input-group">
            <label>preparation</label>
            <input
              type="text"
              placeholder="50min"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              required
            />
          </div>

          {/* Cuisson */}
          <div className="Recipe-input-group">
            <label>cuisson</label>
            <input
              type="text"
              placeholder="50min"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              required
            />
          </div>

                  <div className="Recipe-input-group">
          <label>Portions</label>
          <input
            type="number"
            placeholder="2"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            required
          />
        </div>
        
        </div>

        {/* Ingrédients */}
        <div className="ingredients-wrapper">
          <h2>Ingredients</h2>
          <div className="Container">
            {ingredientObjects.map((ing, index) => (
              <div key={`ingredient-${index}`} style={{ position: "relative" }} className="ingredient-row">

                {/* Champ recherche */}
                <input
                  type="text"
                  placeholder={index === 0 ? "Tomate..." : "Autre ingrédient..."}
                  value={ingredientSearches[index]}
                  onChange={(e) => handleIngredientSearch(index, e.target.value)}
                  onFocus={() => {
                    if (ingredientSearches[index].length > 0) {
                      const newShow = [...showIngredientSuggestions];
                      newShow[index] = true;
                      setShowIngredientSuggestions(newShow);
                    }
                  }}
                  onBlur={() =>
                    setTimeout(() => {
                      const newShow = [...showIngredientSuggestions];
                      newShow[index] = false;
                      setShowIngredientSuggestions(newShow);
                    }, 200)
                  }
                  className="AddMore-Input"
                />

                {/* Suggestions existantes */}
                {showIngredientSuggestions[index] && ingredientSuggestions[index]?.length > 0 && (
                  <ul className="works-suggestions">
                    {ingredientSuggestions[index].map((s) => (
                      <li key={s.id} onMouseDown={() => selectIngredient(index, s)}>
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Aucun résultat → création */}
                {showIngredientSuggestions[index] &&
                  ingredientSearches[index].length > 0 &&
                  ingredientSuggestions[index]?.length === 0 && (
                    <div className="no-work-found">
                      <span>Aucun ingrédient trouvé.</span>
                      <button
                        type="button"
                        onMouseDown={async () => {
                          const id = await createIngredientIfNeeded(ingredientSearches[index]);
                          if (id) {
                            setAllIngredients((prev) => [
                              ...prev,
                              { id, name: ingredientSearches[index] },
                            ]);
                            selectIngredient(index, { id, name: ingredientSearches[index] });
                          }
                        }}
                      >
                        + Créer "{ingredientSearches[index]}"
                      </button>
                    </div>
                  )}

                {/* Quantité */}
                <input
                  type="text"
                  placeholder="200"
                  value={ing.quantity}
                  onChange={(e) => {
                    const newObjects = [...ingredientObjects];
                    newObjects[index] = { ...newObjects[index], quantity: e.target.value };
                    setIngredientObjects(newObjects);
                  }}
                  className="AddMore-Input"
                  style={{ width: "80px" }}
                />

                {/* Unité dropdown */}
                <div className="dropdown-container" style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="dropdown-btn"
                    onClick={() => {
                      const newShow = [...showUnitDropdowns];
                      newShow[index] = !newShow[index];
                      setShowUnitDropdowns(newShow);
                    }}
                    onBlur={() =>
                      setTimeout(() => {
                        const newShow = [...showUnitDropdowns];
                        newShow[index] = false;
                        setShowUnitDropdowns(newShow);
                      }, 150)
                    }
                  >
                    {ing.unit} <span>▼</span>
                  </button>

                  {showUnitDropdowns[index] && (
                    <ul className="works-suggestions">
                      {units.map((u) => (
                        <li
                          key={u}
                          onMouseDown={() => {
                            const newObjects = [...ingredientObjects];
                            newObjects[index] = { ...newObjects[index], unit: u };
                            setIngredientObjects(newObjects);

                            const newShow = [...showUnitDropdowns];
                            newShow[index] = false;
                            setShowUnitDropdowns(newShow);
                          }}
                        >
                          {u}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            <div className="button-AddRemove-Container">
              <button type="button" onClick={addIngredient} className="AddMore-Button">
                <span>Ajouter un ingrédient</span>
              </button>
              <button type="button" onClick={removeIngredient} className="AddMore-Button">
                <span>Enlever un Ingrédient</span>
              </button>
            </div>
          </div>
        </div>

        {/* Étapes */}
        <div className="steps-wrapper">
          <h2>Etapes</h2>
          <div className="Container">
            {steps.map((step, index) => (
              <input
                key={`step-${index}`}
                type="text"
                placeholder={index === 0 ? "1- Capturer un titan" : "Autre etape..."}
                value={step}
                onChange={(e) => handleStepsChange(index, e.target.value)}
                className="AddMore-Input"
              />
            ))}

            <div className="button-AddRemove-Container">
              <button type="button" onClick={addSteps} className="AddMore-Button">
                <span>Ajouter une étape</span>
              </button>
              <button type="button" onClick={removeSteps} className="AddMore-Button">
                <span>Enlever une Étape</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="Form-Footer">
          <label className="cgu-checkbox">
            <input type="checkbox" required />
            <span>
              En cochant cette case vous acceptez nos{" "}
              <NavLink to="/mentions-legales">conditions général</NavLink>.
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