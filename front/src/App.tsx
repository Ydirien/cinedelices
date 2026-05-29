import './App.css';
import { Routes, Route } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';

import HomePage from './pages/homePage/HomePage';
import MentionsLegales from './pages/MentionsPage/MentionsPage';
import Confidentialite from './pages/ConfidentialPage/ConfidentialPage';

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;