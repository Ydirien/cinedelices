import { useState } from "react";
import "./createRecipe.css";

export default function CreatRecipe() {

  const [title, setTitle] = useState("");
  const [movieName, setMovieName] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  

  const [selectedDifficulty, setSelectedDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [selectedThematicId, setSelectedThematicId] = useState<number>(1); 


  const [dropdownDifficulty, setDropDownDifficulty] = useState(false);
  const [dropdownThematic, setDropDownThematic] = useState(false);


  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);


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
    
    const recipePayload = {
      title: title,
      description: description,
      prepTime: Number(prepTime),
      cookTime: 15,    
      servings: 2,     
      difficulty: selectedDifficulty,
      workId: 1,      
      
      // Adaptation du tableau simple en tableau d'objets structurés [{ order, content }]
      steps: steps.map((content, idx) => ({
        order: idx + 1,
        content: content || "Étape sans description"
      })),
      
      // Adaptation temporaire des ingrédients 
      recipeIngredients: ingredients.map((ing) => ({
        ingredientId: 1,
        quantity: 1,
        unit: "pièce(s)"
      })),
      
      thematics: [selectedThematicId] 
    };

    try {
      const response = await fetch("http://localhost:3010/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // sécurité par token
        //   "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(recipePayload),
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
          <div className="RecipeImg"></div>
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
            <div className="Recipe-input-group">
              <label>Movie Name</label>
              <input 
                type="text" 
                placeholder="R+3" 
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                required
              />
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
              <button className="dropdownDefaultButton" type="button" onClick={() => setDropDownThematic(!dropdownThematic)}>
                Thematic: {selectedThematicId === 1 ? "Film" : selectedThematicId === 2 ? "Série" : selectedThematicId === 3 ? "Manga" : "Dessin Animé"}
              </button>
              {dropdownThematic && (
                <div className="dropdown">
                  <button type="button" onClick={() => { setSelectedThematicId(1); setDropDownThematic(false); }}>Film</button>
                  <button type="button" onClick={() => { setSelectedThematicId(2); setDropDownThematic(false); }}>Série</button>
                  <button type="button" onClick={() => { setSelectedThematicId(3); setDropDownThematic(false); }}>Manga</button>
                  <button type="button" onClick={() => { setSelectedThematicId(4); setDropDownThematic(false); }}>Dessin Animé</button>
                </div>
              )}
            </div>

            <div className="dropdown-container">
              <button className="dropdownDefaultButton" type="button" onClick={() => setDropDownDifficulty(!dropdownDifficulty)}>
                Difficulty: {selectedDifficulty}
              </button>
              {dropdownDifficulty && (
                <div className="dropdown">
                  <button type="button" onClick={() => { setSelectedDifficulty("EASY"); setDropDownDifficulty(false); }}>EAZY</button>
                  <button type="button" onClick={() => { setSelectedDifficulty("MEDIUM"); setDropDownDifficulty(false); }}>MEDIUM</button>
                  <button type="button" onClick={() => { setSelectedDifficulty("HARD"); setDropDownDifficulty(false); }}>HARD</button>
                </div>
              )}
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