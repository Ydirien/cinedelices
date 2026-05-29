import { useState } from 'react';

// Type représentant une recette retournée par l'API
type Recipe = { id: number; title: string; description: string };

// Props du composant : onResults est une fonction callback appelée avec les recettes filtrées
// Le composant parent (RecipesPage) passe setRecipes ici pour mettre à jour son state
type Props = { onResults: (recipes: Recipe[]) => void };

// IDs à synchroniser avec les vrais IDs en base de données
const categories = [
  { name: 'Films', id: 1 },
  { name: 'Séries', id: 2 },
  { name: 'Animés', id: 3 },
];

// Types de plats — correspondent aux thématiques (Thematic) dans le schéma Prisma
const types = [
  { name: 'Entrées', id: 1 },
  { name: 'Plats', id: 2 },
  { name: 'Desserts', id: 3 },
  { name: 'Boissons', id: 4 },
];

function FilterBar({ onResults }: Props) {
  // Filtre actif par catégorie (films/séries/animés) — null = aucun filtre
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  // Filtre actif par type de plat — null = aucun filtre
  const [activeTypeId, setActiveTypeId] = useState<number | null>(null);

  // Construit l'URL avec les query params et appelle l'API
  // On passe les valeurs en paramètre plutôt que de lire le state
  // car setState est asynchrone (le state ne serait pas encore mis à jour)
  async function fetchRecipes(categoryId: number | null, typeId: number | null) {
    const params = new URLSearchParams();
    if (categoryId) {
      params.append('categoryId', String(categoryId));
    }
    if (typeId) {
      params.append('typeId', String(typeId));
    }
    // → ex: /api/recipes?categoryId=1&typeId=2
    const res = await fetch(`/api/recipes?${params.toString()}`);
    const data = await res.json();
    // Remonte les recettes au composant parent via la prop onResults
    onResults(data);
  }

  // Cliquer sur une catégorie déjà active la désélectionne (toggle)
  function handleCategory(id: number) {
    const next = activeCategoryId === id ? null : id;
    setActiveCategoryId(next);
    // On passe `next` (valeur calculée) et non `activeCategoryId` (state encore ancien)
    fetchRecipes(next, activeTypeId);
  }

  // Même logique de toggle pour les types de plats
  function handleType(id: number) {
    const next = activeTypeId === id ? null : id;
    setActiveTypeId(next);
    fetchRecipes(activeCategoryId, next);
  }

  return (
    <div className="filter-bar">
      {/* Groupe de boutons pour filtrer par catégorie d'œuvre */}
      <div className="filter-group">
        {categories.map((category) => (
          <button
            key={category.id}
            className={activeCategoryId === category.id ? 'active' : ''}
            onClick={() => handleCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      {/* Groupe de boutons pour filtrer par type de plat */}
      <div className="filter-group">
        {types.map((type) => (
          <button
            key={type.id}
            className={activeTypeId === type.id ? 'active' : ''}
            onClick={() => handleType(type.id)}
          >
            {type.name}
          </button>
        ))}
      </div>
    </div>
  );
}
export default FilterBar;
