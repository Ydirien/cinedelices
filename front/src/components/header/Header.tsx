import { NavLink } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import { LuMenu } from "react-icons/lu";
import { LuSearch } from 'react-icons/lu';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect } from 'react';
import './Header.css';

function SearchBarMobile(){
  
const SearchBar = document.getElementById("SearchBarMobile");
  if(SearchBar?.style.display === "flex")
  {
    SearchBar.style.display = "none";
  }
  else{
    SearchBar.style.display = "flex";
  }
}

function Header({setShowMobileSearch}) {


  const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileNavOpen(false);
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
          <button className='burger-menu' onClick={()=>setMobileNavOpen(!mobileNavOpen)}>
        <LuMenu size={25} />
      </button>
      <NavLink to="/" className="navbar-brand">
        <img src="../../../public/Logo/LOGO_pricipal_allonger.png" alt="CinéDélices Logo" className="logo" />
      </NavLink>
      <nav className="navbar-links">
        <NavLink to="/recettes">Recettes</NavLink>
      </nav>
      <div className='SearchBar-Header'>
          <SearchBar/>
        </div>
      <div className="navbar-actions">
        <button className="btn-create">Créer une recette</button>
        <button className="buttonMobileSearchBar" onClick={() => setShowMobileSearch(prev => !prev)}><LuSearch size={20}/></button>
        <NavLink className="profile" to="/profile">
          <LuCircleUser className="profil-icon" size={35} />
        </NavLink>
      </div>
      </section>
      {mobileNavOpen &&(
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
