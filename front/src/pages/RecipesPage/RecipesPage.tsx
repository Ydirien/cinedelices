import RecipesCards from '../../components/Recipes_cards/RecipesPageCards/RecipesPageCards';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../../components/FilterBar/FilterBar';
import './RecipesPage.css';
import { IRecipe } from '../../../@types/index.d';

interface RecipesPageProps {
  recipes: IRecipe[];
}
function RecipesPage({ recipes }: RecipesPageProps) {

    const [filteredRecipes,setFiltredRecip]= useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    async function Filter() {
    const response = await fetch(`http://localhost:3010/api/recipes?${searchParams.toString()}`);
    const data = await response.json();
    setFiltredRecip(data);
    console.log(data);
  }

  useEffect(()=> {
    Filter();
  },[])
  return (
    <section className="recipes-page">
      <aside className="recipes-sidebar">
        <FilterBar onResults={setFiltredRecip}/>
      </aside>
      <div className="recipes-content">
        {/* On passe le tableau de recettes filtrées au composant de cartes */}
        <RecipesCards recipes={filteredRecipes.length > 0 ? filteredRecipes : recipes} />
      </div>
    </section>
  );
}

export default RecipesPage;
