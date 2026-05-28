import { NavLink } from 'react-router-dom';
import { LuCircleUser } from "react-icons/lu";
import './Header.css';

function Header() {
  return (
    <header className="Header">
      <div className="navbar-brand">
        <img src="../../../public/Logo/LOGO_pricipal_allonger.png" alt="CinéDélices Logo" className="logo" />
      </div>

      <nav className="navbar-links">
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/recettes">Recettes</NavLink>
        <NavLink to="/oeuvre">Oeuvre</NavLink>
      </nav>

      <div className="navbar-actions">
        <button className="btn-create">Créer une recette</button>
        <NavLink className={"profile"} to="/profile">
          <LuCircleUser />
        </NavLink>
      </div>
    </header>
  );
}

export default Header;