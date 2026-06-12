import { useSearchParams } from 'react-router-dom';
import './FilterBar.css';
import { apiFetch } from '../../lib/apiClient';
import { ICategory, IType } from '../../../@types/index.d';
import { useEffect, useState } from 'react';


// FilterBar met à jour les searchParams de l'URL.
// RecipesPage écoute ces params via useEffect([searchParams])
// et relance fetchFilter — ce qui met aussi à jour totalPages pour la pagination.
function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [getAllCategories, setGetAllCategories] = useState<ICategory[]>([]);
  const [getAllTypes, setGetAllTypes] = useState<IType[]>([]);
  const activeCategory = searchParams.get('category');
  const activeThematic = searchParams.get('thematic');

  async function fetchButton(c: string, t: string) {
    try {
      const resCategories = await apiFetch(`/api/${c}`);
      const resTypes = await apiFetch(`/api/${t}`);
      const dataCategories = await resCategories.json();
      const dataTypes = await resTypes.json();
      setGetAllCategories(dataCategories);
      setGetAllTypes(dataTypes);
    } catch (error) {
      console.error('Erreur lors du chargement des bouttons :', error);
    }
  }

  useEffect(() => {
    fetchButton('categories', 'types');
  }, []);

  function setParam(key: string, value: string | null) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (value) p.set(key, value);
      else p.delete(key);
      return p;
    });
  }

  function handleCategory(name: string) {
    setParam('category', activeCategory === name ? null : name);
  }

  function handleThematic(name: string) {
    setParam('thematic', activeThematic === name ? null : name);
  }

  return (
    <div className="filter-bar">
      <div className="filter-group categories-group">
        <h4>Catégories</h4>
        <section className="buttons-group">
          <button
            className={`button-AllCategory ${activeCategory === null ? 'active' : ''}`}
            onClick={() => setParam('category', null)}
          >
            All
          </button>
          {getAllCategories.map((category) => (
            <button
              key={category.name}
              className={activeCategory === category.name ? 'active' : ''}
              onClick={() => handleCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </section>
      </div>

      <div className="filter-group types-group">
        <h4>Types</h4>
        <section className="buttons-group">
          <button
            className={`button-AllThematic ${activeThematic === null ? 'active' : ''}`}
            onClick={() => setParam('thematic', null)}
            type="button"
          >
            All
          </button>
          {getAllTypes.map((thematic) => (
            <button
              key={thematic.name}
              className={activeThematic === thematic.name ? 'active' : ''}
              onClick={() => handleThematic(thematic.name)}
              type="button"
            >
              {thematic.name}
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
export default FilterBar;
