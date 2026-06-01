import RecipesCards from "../../components/Recipes_cards/RecipesPageCards/RecipesPageCards";
import { useState } from 'react';
import FilterBar from '../../components/filterBar/FilterBar';
import './RecipesPage.css';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);

  return (
    <div className="recipes-page">
      <aside className="recipes-sidebar">
        <FilterBar onResults={setRecipes} />
      </aside>
      <div className="recipes-content">
        {/* On passe le tableau de recettes filtrées au composant de cartes */}
        <RecipesCards recipes={recipes} />
      </div>
    </div>
  );
}

export default RecipesPage;