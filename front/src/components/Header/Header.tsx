import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LuCircleUser } from 'react-icons/lu';
import { LuMenu } from 'react-icons/lu';
import { LuSearch } from 'react-icons/lu';
import { LuFilter } from 'react-icons/lu';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useEffect, useRef } from 'react';

import './Header.css';
import { useAuth } from '../../../context/AuthContext/AuthContext';

interface HeaderProps {
  logoMain: string;
}

function Header({ logoMain }: HeaderProps) {
  const raw = localStorage.getItem('User');
  const userInfo = raw ? JSON.parse(raw) : null;
  const roleInfo = userInfo?.role
  const { isConnected, logout } = useAuth();

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // affiche/masque la fenêtre déroulante du profil
  const location = useLocation();
  const navigate = useNavigate(); // pour rediriger vers /login après déconnexion
  const profileMenuRef = useRef<HTMLDivElement>(null); // référence du menu profil pour détecter les clics extérieurs
  //   function toggleMobileSearch()

  //fermetur automatique de la navbar mobile a chaque changement de page/route
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location]);

  // ferme la fenêtre du profil si on clique en dehors
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // déconnecte l'utilisateur, ferme le menu et redirige vers la page de connexion
  function handleLogout() {
    logout();
    setShowProfileMenu(false);
    navigate('/login');
  }

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
    handleResize()

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
          {/* menu profil : icône cliquable + fenêtre déroulante avec les options */}
          <div className="btn-menu" ref={profileMenuRef}>
            {isConnected ? (
              <div className="profile-menu-wrapper">
                {/* clic sur l'icône = ouvre/ferme la fenêtre */}
                <button
                  className="btn-profil"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                >
                  <LuCircleUser size={35}/>
                </button>
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <NavLink to="/profil" onClick={() => setShowProfileMenu(false)}>
                      Mon profil
                    </NavLink>
                    {/* Dashboard visible uniquement pour les admins */}
                    {roleInfo === "ADMIN" && (
                      <NavLink to="/admin/dashboard" onClick={() => setShowProfileMenu(false)}>
                        Dashboard
                      </NavLink>
                    )}
                    <button onClick={handleLogout}>Déconnexion</button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="btn-profil">Se Connecter</NavLink>
            )}
          </div>
          
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
