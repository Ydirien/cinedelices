import './Header.css';

function Header() {
  return (
    <header className="header">
        <div>
            <img src="logo.png" alt="Logo" />
            <h3>Acceuil</h3>
            <h3>Recettes</h3>
        </div>
        <div>
            <h3>Crée une recette</h3>
            <button>profil</button>
        </div>
    </header>
  );
}

export default Header;