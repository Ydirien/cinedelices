import { useState } from "react"
import "./createRecipe.css"

export default function CreatRecipe(){

    const [dropdown,setDropDown]= useState(false);
    const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);

  // Gestion des ingrédients
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };
    
    return(
        <section className="CreateRecipe">
            <div className="Add-Header">
                <h2>Add your Recipe</h2>
                <div className="RecipeImg">

                </div>
            </div>
            <div className="AddRecipeInfo">
                <form action="CreatRecipe-form">
                    <div className="Recipe-name-input">
                        <div className="Recipe-input-group">
                        <label>Recipe Name</label>
                        <input 
                            type="text" 
                            placeholder="Ravitoto" 
                            value={""}
                            required
                        />
                        </div>
                        <div className="Recipe-input-group">
                            <label>Movie Name</label>
                            <input 
                                type="text" 
                                placeholder="R+3" 
                                value={""}
                                required
                            />
                        </div>
                    </div>
                    <div className="Recipe-input-group">
                        <label>Description</label>
                        <textarea 
                            placeholder="Quick description of the movie" 
                            value={""}
                            required
                        />
                    </div>
                </form>
                <div className="Difficulty-PrepaTime">
                    <div className="Recipe-input-group">
                        <label>Prepa Time - (min)</label>
                    <input 
                        type="text" 
                        placeholder="30" 
                        value={""}
                        required
                    />
                    </div>
                    <div>
                        <button className="dropdownDefaultButton" type="button" onClick={() => setDropDown(!dropdown)}>Difficulty</button>
                        {dropdown && (
                            <div id="dropdown" className="dropdown">
                            <button>EAZY</button>
                            <button>MEDIUM</button>
                            <button>HARD</button>
                        </div>
                        )}
                    </div>
                </div>
            </div>
             <div className="space-y-3">
                    <h2 className="text-2xl font-semibold tracking-wide">Ingredients</h2>
                    <div className="bg-[#333333] p-5 rounded-2xl space-y-3 shadow-inner">
                        {ingredients.map((ingredient, index) => (
                            <input
                            key={`ingredient-${index}`}
                            type="text"
                            placeholder={index === 0 ? "Tomate" : "Autre ingrédient..."}
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            className="w-full bg-[#3a3a3a] text-gray-200 placeholder-gray-500 border border-[#444] rounded-lg py-2 px-4 outline-none focus:border-gray-500 transition-colors"
                            />
                        ))}
                        
                        <button type="button"
                            onClick={addIngredient}
                            className="AddMore-Button">
                            <span>Ajouter un ingrédient</span>
                        </button>
                    </div>
                </div>
            <button>
                Send
            </button>
        </section>
    )
}