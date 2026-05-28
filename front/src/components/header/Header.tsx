import { NavLink } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import { LuSearch } from 'react-icons/lu';
import { LuMenu } from "react-icons/lu";
import './Header.css';

function Header() {
  return (
    <header className="Header">
      <button className='burger-menu'>
        <LuMenu size={25} />
      </button>
      <NavLink to="/" className="navbar-brand">
        <img src="../../../public/Logo/LOGO_pricipal_allonger.png" alt="CinéDélices Logo" className="logo" />
      </NavLink>
      <nav className="navbar-links">
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/recettes">Recettes</NavLink>
      </nav>

      <div className="navbar-actions">
        <button className="btn-create">Créer une recette</button>
        <NavLink to="/profile">Profile</NavLink>
      </div>
    </header>
  );
}

export default Header;