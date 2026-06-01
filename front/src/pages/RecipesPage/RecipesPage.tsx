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
        {/* grille de recettes */}
      </div>
    </div>
  );
}

export default RecipesPage;
