import { useState, useEffect } from "react";
import "./createRecipe.css";

export default function CreatRecipe() {

  const [title, setTitle] = useState("");
  const [movieName, setMovieName] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  

  const [selectedDifficulty, setSelectedDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [selectedThematicId, setSelectedThematicId] = useState<number>(1); 


  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);

  const [works, setWorks] = useState<{id: number, title: string}[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<number>(0);
  const [workSearch, setWorkSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredWorks = works.filter(w =>
    w.title.toLowerCase().includes(workSearch.toLowerCase())
  );

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3010/api/works", {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    })
      .then(r => r.json())
      .then(data => setWorks(data));
  }, []);

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = () => {
    if (ingredients.length > 1) setIngredients(ingredients.slice(0, -1));
    else setIngredients(['']);
  };


  const handleStepsChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addSteps = () => setSteps([...steps, '']);
  const removeSteps = () => {
    if (steps.length > 1) setSteps(steps.slice(0, -1));
    else setSteps(['']);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("prepTime", String(Number(prepTime)));
    formData.append("cookTime", String(Number(prepTime)));
    formData.append("servings", "2");
    formData.append("difficulty", selectedDifficulty);
    formData.append("workId", String(Number(selectedWorkId)));

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

    try {
      const response = await fetch("http://localhost:3010/api/recipes", {
        method: "POST",
        headers: {
  "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
},
        body: formData,
      });

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
              <label>Recipe Name</label>
              <input 
                type="text" 
                placeholder="Ravitoto" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="Recipe-input-group" style={{ position: 'relative' }}>
              <label>Movie / Series</label>
              <input
                type="text"
                placeholder="Rechercher une œuvre..."
                value={workSearch}
                onChange={(e) => {
                  setWorkSearch(e.target.value);
                  setSelectedWorkId(0);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                required
              />
              {showSuggestions && workSearch && filteredWorks.length > 0 && (
                <ul className="works-suggestions">
                  {filteredWorks.map(w => (
                    <li
                      key={w.id}
                      onMouseDown={() => {
                        setSelectedWorkId(w.id);
                        setWorkSearch(w.title);
                        setShowSuggestions(false);
                      }}
                    >
                      {w.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="Recipe-input-group">
            <label>Description</label>
            <textarea 
              placeholder="Quick description of the movie" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="Difficulty-PrepaTime-Thematic">

            <div className="dropdown-container">
              <label>Thematic</label>
              <select value={selectedThematicId} onChange={(e) => setSelectedThematicId(Number(e.target.value))}>
                <option value={1}>Film</option>
                <option value={2}>Série</option>
                <option value={3}>Manga</option>
                <option value={4}>Dessin Animé</option>
              </select>
            </div>

            <div className="dropdown-container">
              <label>Difficulty</label>
              <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")}>
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
          </div>
        <div className="Recipe-input-group">
            <label>Prepa Time - (min)</label>
            <input 
                type="number" 
                placeholder="30" 
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                required
              />
            </div>
        </div>

        <div className="Ingredient-Steps">
          <h2>Ingredients</h2>
          <div className="Container">
            {ingredients.map((ingredient, index) => (
              <input
                key={`ingredient-${index}`}
                type="text"
                placeholder={index === 0 ? "Tomate" : "Autre ingrédient..."}
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="AddMore-Input"
              />
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

          <h2>Steps</h2>
          <div className="Container">
            {steps.map((step, index) => (
              <input
                key={`step-${index}`}
                type="text"
                placeholder={index === 0 ? "MELANGER MELANGER MELANGER" : "Autre etape..."}
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

        <button type="submit" className="Send-Button">
          Send
        </button>

      </form>
    </section>
  );
}