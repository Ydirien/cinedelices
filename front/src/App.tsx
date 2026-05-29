
import './App.css'
import Header from './components/header/Header';
import Footer from './components/footer/Footer'
import HomePage from './pages/homePage/HomePage';
import { Route, Routes } from 'react-router-dom';
import RecipesPage from './pages/RecipesPage/RecipesPage';
import { useState } from 'react';
import MentionsLegales from './pages/MentionsPage/MentionsPage';
import Confidentialite from './pages/ConfidentialPage/ConfidentialPage';

function App() {
<<<<<<< HEAD
  
  return (
    <>
      <Header />
      <main>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/recettes' element={<RecipesPage/>}/>
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
      </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;