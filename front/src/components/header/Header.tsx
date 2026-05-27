import './header.css';
import {NavLink} from 'react-router-dom';

function Header() {
  return (
    <header className="Header">
      <div className="navbar-brand">
        <img src="../public/Logo/LOGO.png" alt="CinéDélices Logo" className="logo" />
      </div>

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