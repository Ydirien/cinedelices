import { useState } from 'react';



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

import { useSearchParams } from "react-router-dom";

function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategoryId = searchParams.get("category");
  const activeTypeIds = searchParams.getAll("type");

  function handleCategory(id: number) {
    const params = new URLSearchParams(searchParams);

    if (params.get("category") === String(id)) {
      params.delete("category");
    } else {
      params.set("category", String(id));
    }

    setSearchParams(params);
  }

  function handleType(id: number) {
    const params = new URLSearchParams(searchParams);

    const current = params.getAll("type");

    if (current.includes(String(id))) {
      params.delete("type");
      current
        .filter((t) => t !== String(id))
        .forEach((t) => params.append("type", t));
    } else {
      params.append("type", String(id));
    }

    setSearchParams(params);
  }

  async function Filter() {
    const response = await fetch(`http://localhost:3010/recettes?${searchParams.toString()}`);
    const data = await response.json();
  }

  return (
    <div className="filter-bar">
      <div className="filter-group">
        {categories.map((category) => (
          <button
            key={category.id}
            className={activeCategoryId === String(category.id) ? "active" : ""}
            onClick={() => handleCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="filter-group">
        {types.map((type) => (
          <button
            key={type.id}
            className={activeTypeIds.includes(String(type.id)) ? "active" : ""}
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
