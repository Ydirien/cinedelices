import { useState } from 'react';
import { IRecipe } from '../../../@types/index.d';
import "./FilterBar.css"

interface Props {
  onResults: (recipes: IRecipe[]) => void;
}

const categories = [
  { name: 'Film' },
  { name: 'Série' },
  { name: 'Manga / Anime' },
  { name: 'Dessin animé' },
];

const thematics = [
  { name: 'Entrée' },
  { name: 'Plat' },
  { name: 'Dessert' },
  { name: 'Boisson' },
];

function FilterBar({ onResults }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeThematics, setActiveThematics] = useState<string[]>([]);

  // ADAPTATION DU FETCH POUR LES TABLEAUX
  async function fetchRecipes(category: string | null, thematicsList: string[]) {
    const params = new URLSearchParams();
    
    if (category) {
      params.append('category', category);
    }
    
    // Pour chaque thématique active, on l'ajoute individuellement 
    // afin de répéter la clé dans l'URL : ?thematic=Plat&thematic=Dessert
    thematicsList.forEach(thematic => {
      params.append('thematic', thematic);
    });

    const res = await fetch(`/api/recipes?${params.toString()}`);
    const data = await res.json();
    onResults(data);
  }

  function handleCategory(name: string) {
    const next = activeCategory === name ? null : name;
    setActiveCategory(next);
    fetchRecipes(next, activeThematics); 
  }

  function handleThematic(name: string) {
    let nextThematics: string[];
    
    if (activeThematics.includes(name)) {
      nextThematics = activeThematics.filter(t => t !== name);
    } else {
      nextThematics = [...activeThematics, name];
    }
    
    setActiveThematics(nextThematics);
    fetchRecipes(activeCategory, nextThematics);
  }

  function handleAllCategories() {
    setActiveCategory(null);
    fetchRecipes(null, activeThematics); 
  }

  function handleAllThematics() {
    setActiveThematics([]); 
    fetchRecipes(activeCategory, []); 
  }

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <button 
          key="all category" 
          className={`button-AllCategory ${activeCategory === null ? 'active' : ''}`}
          onClick={handleAllCategories}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            className={activeCategory === category.name ? 'active' : ''}
            onClick={() => handleCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="filter-group">
        <button 
          key="all thematic" 
          className={`button-AllThematic ${activeThematics.length === 0 ? 'active' : ''}`}
          onClick={handleAllThematics}
          type="button"
        >
          All
        </button>
        
        {thematics.map((thematic) => (
          <button
            key={thematic.name}
            className={activeThematics.includes(thematic.name) ? 'active' : ''}
            onClick={() => handleThematic(thematic.name)}
            type="button"
          >
            {thematic.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;