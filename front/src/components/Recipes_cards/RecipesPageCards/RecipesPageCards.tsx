import { NavLink } from 'react-router-dom';
import './RecipesStyles.css';

// import defaultRecipes from '../../../../data/recipe.json';
// import Work from '../../../../data/works.json';
// import Categories from '../../../../data/categories.json';
import { IRecipe } from '../../../../@types/index.d';
import StarsRating from '../Stars/StarsRating';

interface RecipesPageCardsProps {
  recipes: IRecipe[];
}

// On récupère "recipes" depuis les props passées par RecipesPage
export default function RecipesPageCards({ recipes }: RecipesPageCardsProps) {
  // Si la FilterBar n'a pas encore renvoyé de données (ex: tableau vide au départ),
  // on peut afficher toutes les recettes par défaut.
  const recipesToDisplay = recipes;

  return (
    <section className="RecipesContainer">
      <ul>
        {recipesToDisplay.map((recipe) => {
          const work = recipe.work;
          const type = recipe.thematics

          return (
            <li key={recipe.id}>
              <div className="RecipesPCard">
                <NavLink to={`/recettes/${recipe.id}`}>
                  <div className="RecipeIMG">
                    {/* Note : Tu pourras remplacer l'image fixe par recipe.image si tu veux afficher la vraie photo */}
                    <img src={recipe.image} alt={recipe.title} className="recetteImage" />
                  </div>
                  <div className="Content-Info">
                    <h2 className="Content-Type">{type[0].thematic.name}</h2>
                    <div className="Recipe-Info">
                      <h3>{recipe.title}</h3>
                      <h4>{work.title}</h4>
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
