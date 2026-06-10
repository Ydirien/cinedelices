import { NavLink, useLocation } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import { LuMenu } from 'react-icons/lu';
import { LuSearch } from 'react-icons/lu';
import { LuFilter } from 'react-icons/lu';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect } from 'react';

import './Header.css';
import { useAuth } from '../../../context/AuthContext/AuthContext';

interface HeaderProps {
  logoMain: string;
}

function Header({ logoMain }: HeaderProps) {
  const { isConnected } = useAuth();

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const location = useLocation();
  //   function toggleMobileSearch()

  //fermetur automatique de la navbar mobile a chaque changement de page/route
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileNavOpen(false);
        setShowMobileSearch(true);
        setShowLogo(true);
      } else {
        setShowMobileSearch(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="Header">
      <section className="Header-Nav">
        <button className="burger-menu" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          <LuMenu size={25} />
        </button>
        <NavLink to="/" className="navbar-brand">
          {showLogo && <img src={logoMain} alt="CinéDélices Logo" className="logo" />}
        </NavLink>
        <nav className="navbar-links">
          <NavLink to="/recettes">Recettes</NavLink>
        </nav>
        <div className="SearchBar-Header"></div>
        {showMobileSearch && <SearchBar />}
        <div className="navbar-actions">
          <button className="btn-create">Créer une recette</button>
          <button
            className="buttonMobileSearchBar"
            onClick={() => {
              setShowMobileSearch((prev) => !prev);
              setShowLogo(showMobileSearch);
            }}
          >
            <LuSearch size={20} />
          </button>
          {isConnected ? (
            <NavLink to="/profil" className="btn-profil">
              Mon profil
            </NavLink>
          ) : (
            <NavLink to="/login" className="btn-profil">Se Connecter</NavLink>
          )}
          
        </div>
      </section>
      {mobileNavOpen && (
        <section id="Header-NavMobile">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/profil">Profil</NavLink>
          <NavLink to="/recettes">Recettes</NavLink>
          <NavLink to="/create">Créer une recette </NavLink>
        </section>
      )}
    </header>
  );
}

export default Header;
