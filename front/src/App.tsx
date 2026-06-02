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
import logoMain from '../../../public/Logo/LOGO_pricipal_allonger.png';

function App() {
  const [getAllRecipes, setGetAllrecipes] = useState<IRecipe[]>([]) // recupérer les données de la data recipe en attendants la bdd 
  
  const [showMobileSearch, setShowMobileSearch] = useState(false); // useState pour cacher/montrer la barre de recherche en version mobile

  // fetch pour appelle de toutes les recettes 
useEffect( ()=>{
    async function fetchRecipes(){
      const res = await fetch('http://localhost:3010/api/recipes')
      const data = await res.json()
      setGetAllrecipes(data)
    }
  },[])

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
      <Header setShowMobileSearch={setShowMobileSearch} logoMain={logoMain}/>
        <main>
          {showMobileSearch && (
            <section id='SearchBarMobile'>
            <SearchBar/>
          </section>
          )}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/recettes' element={<RecipesPage recipes={getAllRecipes}/>}/>
          <Route path='/recettes/:recette' element={<RecipePage/>}/>
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          
        </Routes>
        </main>
      <Footer />
    </>
  );
}

export default App;