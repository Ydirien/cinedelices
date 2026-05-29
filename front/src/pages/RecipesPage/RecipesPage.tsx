import { useState } from 'react';
import FilterBar from '../../components/filterBar/FilterBar';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  return( <FilterBar onResults={setRecipes}/>);
}

export default RecipesPage;
