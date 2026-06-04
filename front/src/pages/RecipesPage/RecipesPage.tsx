import RecipesCards from '../../components/Recipes_cards/RecipesPageCards/RecipesPageCards';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../../components/FilterBar/FilterBar';
import NoRecipePage from '../../components/Recipes_cards/RecipesPageCards/NoRecipesFound';
import './RecipesPage.css';
import { IRecipe } from '../../../@types/index.d';

interface RecipesPageProps {
  recipes: IRecipe[]; // Tes recettes initiales (toutes)
}

function RecipesPage({ recipes }: RecipesPageProps) {
  const [filteredRecipes, setFilteredRecipes] = useState<IRecipe[] | null>(null);
  const [searchParams] = useSearchParams();

  async function fetchFilter() {
    try {
      const response = await fetch(`http://localhost:3010/api/recipes?${searchParams.toString()}`);
      const data = await response.json();
      setFilteredRecipes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des recettes :", error);
      setFilteredRecipes([]);
    }
  }

  useEffect(() => {
    fetchFilter();
  }, [searchParams]);


  // Si filteredRecipes est null (en attente du fetch), on montre les recettes de base
  const recipesToDisplay = filteredRecipes !== null ? filteredRecipes : recipes;

  return (
    <section className="recipes-page">
      <aside className="recipes-sidebar">
        <FilterBar onResults={setFilteredRecipes} />
      </aside>
      <div className="recipes-content">
        {recipesToDisplay.length > 0 ? (
          <RecipesCards recipes={recipesToDisplay} />
        ) : (
          <NoRecipePage />
        )}
      </div>
    </section>
  );
}

export default RecipesPage;