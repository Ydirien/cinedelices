import { useEffect, useState } from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import "./SearchPage.css";

// Je définis le type d'une recette pour que TypeScript sache quelles données j'utilise
type Recipe = {
  id: number;
  title: string;
  description?: string;
  image?: string;
};

export default function SearchPage() {
  // Je récupère les paramètres présents dans l'URL
  const [searchParams] = useSearchParams();

  // Je récupère la valeur du paramètre q, par exemple /search?q=naruto
  const query = searchParams.get("q") ?? "";

  // Je stocke ici les recettes trouvées par la recherche
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Je stocke ici l'état de chargement pour afficher un message pendant le fetch
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSearchRecipes() {
      try {
        // Si la recherche est vide, je vide les résultats et je ne lance pas de fetch
        if (!query.trim()) {
          setRecipes([]);
          return;
        }

        // Je passe loading à true avant de lancer la récupération des données
        setLoading(true);

        // J'appelle ma route API dédiée à la recherche de recettes
        const response = await fetch(
          `http://localhost:3010/api/recipes/search?q=${encodeURIComponent(query)}`
        );

        // Si la réponse n'est pas correcte, je déclenche une erreur
        if (!response.ok) {
          throw new Error("Erreur lors de la recherche des recettes");
        }

        // Je transforme la réponse en JSON
        const data = await response.json();

        // Je stocke les recettes trouvées dans le state
        setRecipes(data);
      } catch (error) {
        // J'affiche l'erreur dans la console pour la comprendre pendant le développement
        console.error(error);
      } finally {
        // Une fois le fetch terminé, je désactive le chargement
        setLoading(false);
      }
    }

    // Je relance la recherche à chaque fois que le mot recherché change dans l'URL
    fetchSearchRecipes();
  }, [query]);

  return (
    <main className="SearchPage">
      <h1>Résultats de recherche</h1>

      <p>
        Recherche pour : <strong>{query}</strong>
      </p>

      {/* J'affiche ce message pendant que les recettes sont en train de charger */}
      {loading && (
        <p className="SearchPage-loading">Chargement des recettes...</p>
      )}

      {/* J'affiche ce message si la recherche est terminée mais qu'aucune recette n'a été trouvée */}
      {!loading && recipes.length === 0 && query && (
        <p className="SearchPage-empty">
          Aucune recette trouvée pour cette recherche.
        </p>
      )}

      {/* J'affiche ici les recettes trouvées par la recherche */}
      <section className="SearchPage-results">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="SearchPage-card">
            {/* Si la recette possède une image, je l'affiche */}
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title} />
            )}

            <h2>{recipe.title}</h2>

            {/* Si la recette possède une description, je l'affiche */}
            {recipe.description && <p>{recipe.description}</p>}

            <NavLink to={`/recettes/${recipe.id}`}>
              Voir la recette
            </NavLink>
          </article>
        ))}
      </section>
    </main>
  );
}