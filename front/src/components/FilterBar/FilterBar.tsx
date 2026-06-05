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
  // 1. Changement : On passe d'un tableau [] à une valeur unique ou null
  const [activeThematic, setActiveThematic] = useState<string | null>(null);

  async function fetchRecipes(category: string | null, thematic: string | null) {
    const params = new URLSearchParams();
    
    if (category) {
      params.append('category', category);
    }
    
    if (thematic) {
      params.append('thematic', thematic);
    }

    const res = await fetch(`/api/recipes?${params.toString()}`);
    const data = await res.json();
    onResults(data);
  }

  function handleCategory(name: string) {
    const next = activeCategory === name ? null : name;
    setActiveCategory(next);
    fetchRecipes(next, activeThematic); 
  }

  //sélection unique pour les thématiques
  function handleThematic(name: string) {
    const next = activeThematic === name ? null : name;
    setActiveThematic(next);
    fetchRecipes(activeCategory, next);
  }

  function handleAllCategories() {
    setActiveCategory(null);
    fetchRecipes(null, activeThematic); 
  }

  //remise à zéro
  function handleAllThematics() {
    setActiveThematic(null); 
    fetchRecipes(activeCategory, null); 
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
          // 5. Mise à jour de la condition active pour "All"
          className={`button-AllThematic ${activeThematic === null ? 'active' : ''}`}
          onClick={handleAllThematics}
          type="button"
        >
          All
        </button>
        
        {thematics.map((thematic) => (
          <button
            key={thematic.name}
            // 6. Comparaison directe de la chaîne au lieu de .includes()
            className={activeThematic === thematic.name ? 'active' : ''}
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
