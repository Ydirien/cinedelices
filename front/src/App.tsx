
import './App.css'
import { useEffect } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer'
import HomePage from './pages/homePage/HomePage';
import RecipesPage from './pages/RecipesPage/RecipesPage';
import { Route, Routes } from 'react-router-dom';
import SearchBar from './components/SearchBar/SearchBar';
import { useState } from 'react';
import MentionsLegales from './pages/MentionsPage/MentionsPage';
import Confidentialite from './pages/ConfidentialPage/ConfidentialPage';

function App() {
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
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
        </Routes>
        </main>

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
        </Routes>
        </main>
      <Footer />
    </>
  );
}

export default App;