import { useState } from 'react';
import { IRecipe } from '../../../@types/index.d';

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
  const [activeThematic, setActiveThematic] = useState<string | null>(null);

  async function fetchRecipes(category: string | null, thematic: string | null) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (thematic) params.append('thematic', thematic);
    const res = await fetch(`/api/recipes?${params.toString()}`);
    const data = await res.json();
    onResults(data);
  }

  function handleCategory(name: string) {
    const next = activeCategory === name ? null : name;
    setActiveCategory(next);
    fetchRecipes(next, activeThematic);
  }

  function handleThematic(name: string) {
    const next = activeThematic === name ? null : name;
    setActiveThematic(next);
    fetchRecipes(activeCategory, next);
  }

  return (
    <div className="filter-bar">
      <div className="filter-group">
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
        {thematics.map((thematic) => (
          <button
            key={thematic.name}
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
