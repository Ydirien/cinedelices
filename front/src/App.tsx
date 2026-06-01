
import './App.css'
import { useEffect } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer'
import HomePage from './pages/homePage/HomePage';
import RecipesPage from './pages/RecipesPage/RecipesPage';
import RecipePage from './pages/RepicePage/Recipe';
import { Route, Routes } from 'react-router-dom';
import SearchBar from './components/SearchBar/SearchBar';
import { useState } from 'react';
import MentionsLegales from './pages/MentionsPage/MentionsPage';
import Confidentialite from './pages/ConfidentialPage/ConfidentialPage';
import { IRecipe } from '../@types/index.d';
import recipes from "../data/recipe.json"

function App() {
  const [getAllRecipes, setGetAllrecipes] = useState<IRecipe>(recipes)
  
  const [showMobileSearch, setShowMobileSearch] = useState(false); // useState pour cacher/montrer la barre de recherche en version mobile

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 900) {
      setShowMobileSearch(false);
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize(); // important au chargement

  return () => window.removeEventListener("resize", handleResize);
}, []);
  return (
    <>
      <Header setShowMobileSearch={setShowMobileSearch}/>
        <main>
          {showMobileSearch && (
            <section id='SearchBarMobile'>
            <SearchBar/>
          </section>
          )}
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/recettes' element={<RecipesPage/>}/>
          <Route path='/recettes/:recette' element={<RecipePage/>}/>
          
        </Routes>
        </main>
      <Footer />
    </>
  );
}

export default App;