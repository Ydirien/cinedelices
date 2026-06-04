import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";

export default function SearchBar() {
  // Stocke ici ce que l'utilisateur écrit dans la barre de recherche
  const [search, setSearch] = useState("");

  // Récupère navigate pour pouvoir rediriger l'utilisateur vers une autre page
  const navigate = useNavigate();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    // J'empêche le rechargement de la page quand le formulaire est validé
    event.preventDefault();

    // Nettoie la recherche pour éviter les espaces inutiles avant/après
    const cleanSearch = search.trim();

    // Si la recherche est vide, je ne fais rien
    if (!cleanSearch) {
      return;
    }

    // Redirige vers la page de recherche avec le mot tapé dans l'URL
    navigate(`/search?q=${encodeURIComponent(cleanSearch)}`);
  }

  return (
    <form className="SearchBar" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="exemple : Naruto"
        value={search}
        // À chaque changement dans l'input, je mets à jour ma recherche
        onChange={(event) => setSearch(event.target.value)}
      />

      <button type="submit" className="search-submit">
        <LuSearch size={20} />
      </button>
    </form>
  );
}