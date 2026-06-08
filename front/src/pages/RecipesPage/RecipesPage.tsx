import RecipesCards from '../../components/Recipes_cards/RecipesPageCards/RecipesPageCards';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../../components/FilterBar/FilterBar';
import NoRecipePage from '../../components/Recipes_cards/RecipesPageCards/NoRecipesFound';
import Pagination from '../../components/Pagination/Pagination';
import './RecipesPage.css';
import { IRecipe } from '../../../@types/index.d';
import { API_URL } from '../../constants';

const LIMIT = 9; // nombre de recettes par page



function RecipesPage() {
  const [getAllRecipes, setGetAllrecipes] = useState<IRecipe[]>([]); // recupérer les données de la data recipe en attendants la bdd
  const [filteredRecipes, setFilteredRecipes] = useState<IRecipe[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const resRecipes = await fetch(`${API_URL}/api/recipes`);
        const dataRecipes = await resRecipes.json();
        setGetAllrecipes(dataRecipes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
      }
    }
    fetchData();
  }, []);

  async function fetchFilter(page = 1) {
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(page));
      params.set('limit', String(LIMIT));

      const response = await fetch(`${API_URL}/api/recipes?${params.toString()}`);
      const data = await response.json();

      setFilteredRecipes(data.data);
      // totalPages vient du back — fallback à 1 si le back ne le renvoie pas encore
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes :', error);
      setFilteredRecipes([]);
    }
  }

  // Quand les filtres changent, on repart toujours à la page 1
  useEffect(() => {
    setCurrentPage(1);
    fetchFilter(1);
  }, [searchParams]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
    fetchFilter(page);
    // Remonte en haut de la zone de contenu au changement de page
    document.querySelector('.recipes-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const recipesToDisplay = filteredRecipes !== null ? filteredRecipes : getAllRecipes;

  return (
    <section className="recipes-page">
      <aside className="recipes-sidebar">
        <FilterBar />
      </aside>

      <div className="recipes-content section-container">
        {recipesToDisplay.length > 0 ? (
          <>
            <RecipesCards recipes={recipesToDisplay} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        ) : (
          <NoRecipePage />
        )}
      </div>
    </section>
  );
}

export default RecipesPage;
