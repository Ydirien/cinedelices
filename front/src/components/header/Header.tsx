import { NavLink } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import { LuSearch } from 'react-icons/lu';
import { LuMenu } from "react-icons/lu";
import './Header.css';

function NavBarMobile(){
  
const NavBar = document.getElementById("Header-NavMobile");
  if(NavBar?.style.display === "flex")
  {
    NavBar.style.display = "none";
  }
  else{
    NavBar.style.display = "flex";
  }
}

function Header() {
  return (
    <header className="Header">
      <section className="Header-Nav">
          <button className='burger-menu' onClick={NavBarMobile}>
        <LuMenu size={25} />
      </button>
      <NavLink to="/" className="navbar-brand">
        <img src="../../../public/Logo/LOGO_pricipal_allonger.png" alt="CinéDélices Logo" className="logo" />
      </NavLink>
      <nav className="navbar-links">
        <NavLink to="/recettes">Recettes</NavLink>
      </nav>
      <div className="SearchBar">
        <input type="seach" placeholder="exemple : Naruto" />
        <LuSearch size={20} />
      </div>
      <div className="navbar-actions">
        <button className="btn-create">Créer une recette</button>
        <NavLink className="profile" to="/profile">
          <LuCircleUser className="profil-icon" size={35} />
        </NavLink>
      </div>
      </section>
      <section id="Header-NavMobile"> 
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/profil">Profil</NavLink>
        <NavLink to="/recettes">Recettes</NavLink>
        <NavLink to="/create">Créer une recette </NavLink>
      </section>
    </header>
  );
}

export default Header;
