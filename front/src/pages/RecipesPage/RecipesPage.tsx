import RecipesCards from '../../components/Recipes_cards/RecipesPageCards/RecipesPageCards';
import { useEffect, useState } from 'react';
import FilterBar from '../../components/FilterBar/FilterBar';
import './RecipesPage.css';
import { IRecipe } from '../../../@types/index.d';

interface RecipesPageProps {
  recipes: IRecipe[];
}
function RecipesPage({ recipes }: RecipesPageProps) {
  const [filteredRecipes, setFilteredRecipes] = useState([]); // recepérer les recettes filtrer

  return (
    <section className="recipes-page">
      <aside className="recipes-sidebar">
        <FilterBar onResults={setFilteredRecipes} />
      </aside>
      <div className="recipes-content">
        {/* On passe le tableau de recettes filtrées au composant de cartes */}
        <RecipesCards recipes={recipes} />
      </div>
    </section>
  );
}

export default RecipesPage;
