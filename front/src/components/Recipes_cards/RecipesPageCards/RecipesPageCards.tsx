import { NavLink } from 'react-router-dom';
import './RecipesStyles.css';

// import defaultRecipes from '../../../../data/recipe.json';
// import Work from '../../../../data/works.json';
// import Categories from '../../../../data/categories.json';
import { IRecipe } from '../../../../@types/index.d';
import StarsRating from '../stars/StarsRating';

interface RecipesPageCardsProps {
  recipes: IRecipe[];
}

// On récupère "recipes" depuis les props passées par RecipesPage
export default function RecipesPageCards({ recipes }: RecipesPageCardsProps) {
  // Si la FilterBar n'a pas encore renvoyé de données (ex: tableau vide au départ),
  // on peut afficher toutes les recettes par défaut.
  const recipesToDisplay = recipes;
  console.log('Recipes to display:', recipesToDisplay); // Debug : vérifier les données reçues

  return (
    <section className="RecipesContainer">
      <ul>
        {recipesToDisplay.map((recipe) => {
          const matchMovie = Work.find((work) => work.id === recipe.workId);
          const matchCategorie = Categories.find((Categorie) => Categorie.id === matchMovie?.categoryId);

          return (
            <li key={recipe.id}>
              <div className="RecipesPCard">
                <NavLink to="/recettes/1">
                  <div className="RecipeIMG">
                    {/* Note : Tu pourras remplacer l'image fixe par recipe.image si tu veux afficher la vraie photo */}
                    <img src={recipe.image} alt={recipe.title} className="recetteImage" />
                  </div>
                  <div className="Content-Info">
                    <h2 className="Content-Type">{matchCategorie?.name}</h2>
                    <div className="Recipe-Info">
                      <h3>{recipe.title}</h3>
                      <h4>{matchMovie?.title}</h4>
                      <div className="Rating">
                        <StarsRating />
                        <p>
                          - {recipe.prepTime}min - {recipe.difficulty}
                        </p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
