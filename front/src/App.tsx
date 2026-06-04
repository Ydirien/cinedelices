import './App.css';
import { useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import RecipesPage from './pages/RecipesPage/RecipesPage';
import RecipePage from './pages/RepicePage/Recipe';
import { Route, Routes } from 'react-router-dom';
import SearchBar from './components/SearchBar/SearchBar';
import { useState } from 'react';
import MentionsLegales from './pages/MentionsPage/MentionsPage';
import Confidentialite from './pages/ConfidentialPage/ConfidentialPage';
import { ICategory, IRecipe, IType } from '../@types/index.d';
import recipes from '../data/recipe.json';
import logoMain from '../public/Logo/LOGO_pricipal_allonger.png';
import Register from './pages/Auth/register/Register';

function App() {
  const [getAllRecipes, setGetAllrecipes] = useState<IRecipe[]>([]); // recupérer les données de la data recipe en attendants la bdd

  const [getAllCategories, setGetAllCategories] = useState<ICategory[]>([]);

  const [getAllTypes, setGetAllTypes] = useState<IType[]>([]);

  const [showMobileSearch, setShowMobileSearch] = useState(false); // useState pour cacher/montrer la barre de recherche en version mobile

  // fetch pour appelle de toutes les recettes
  useEffect(() => {
    
    async function fetchData() {
      const category = await fetch(`/api/category`);
      const types = await fetch(`/api/type`);
      const recipes = await fetch(`/api/recipes`);
      const dataRecipes = await recipes.json();
      const dataCategories = await category.json();
      const dataTypes = await types.json();
      setGetAllrecipes(dataRecipes);
      setGetAllCategories(dataCategories)
      setGetAllTypes(dataTypes)
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setShowMobileSearch(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // important au chargement

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      <Header setShowMobileSearch={setShowMobileSearch} logoMain={logoMain} />
      <main>
        {showMobileSearch && (
          <section id="SearchBarMobile">
            <SearchBar />
          </section>
        )}
        <Routes>
          <Route path="/" element={<HomePage categories={getAllCategories} types={getAllTypes} recipes={getAllRecipes}/>} />
          <Route path="/recettes" element={<RecipesPage recipes={getAllRecipes} />} />
          <Route path="/recettes/:recette" element={<RecipePage />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Register />} />
          <Route path="/passwordforgot" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
