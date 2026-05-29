
import RecipesCards from "../../components/Recipes_cards/RecipesPageCards/RecipesPageCards";
import { useState } from 'react';
import FilterBar from '../../components/filterBar/FilterBar';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  return( 
      <>  
        <div>
          <FilterBar onResults={setRecipes}/>
      <RecipesCards/>
        </div>
      </>
  );
}

export default RecipesPage;