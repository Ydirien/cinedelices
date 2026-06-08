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

import logoMain from '../public/Logo/LOGO_pricipal_allonger.png';
import Register from './pages/Auth/register/Register';
import Login from './pages/Auth/login/login';
import Passwordlost from './pages/Auth/passwordlost/passwordlost';
import SearchPage from './pages/SearchPage/SearchPage';
import CreatRecipe from './pages/CreateRecipe/CreateRecipe';
import { API_URL } from './constants';

function App() {

  const [showMobileSearch, setShowMobileSearch] = useState(false); // useState pour cacher/montrer la barre de recherche en version mobile



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
          <Route path="/" element={<HomePage   />} />
          <Route path="/recettes" element={<RecipesPage />} />
          <Route path="/recettes/:recette" element={<RecipePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passwordlost" element={<Passwordlost />} />
          <Route path="/createrecipe" element={<CreatRecipe />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;