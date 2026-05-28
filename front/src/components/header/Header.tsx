import { NavLink } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import { LuSearch } from 'react-icons/lu';
import './Header.css';

function Header() {
  return (
    <header className="Header">
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
    </header>
  );
}

export default Header;
