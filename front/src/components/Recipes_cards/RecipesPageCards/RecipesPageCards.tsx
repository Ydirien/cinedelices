import { NavLink } from 'react-router-dom';
import './RecipesStyles.css';

import defaultRecipes from '../../../../data/recipe.json';
import Work from '../../../../data/works.json';
import Categories from '../../../../data/categories.json';
import img from ''

// On récupère "recipes" depuis les props passées par RecipesPage
export default function RecipesPageCards({ recipes }) {
  // Si la FilterBar n'a pas encore renvoyé de données (ex: tableau vide au départ),
  // on peut afficher toutes les recettes par défaut.
  const recipesToDisplay = recipes && recipes.length > 0 ? recipes : defaultRecipes;

  return (
    <section className="RecipesContainer">
      <ul>
        {recipesToDisplay.map((Recipe) => {
          const matchMovie = Work.find((work) => work.id === Recipe.workId);
          const matchCategorie = Categories.find((Categorie) => Categorie.id === matchMovie?.categoryId);

          return (
            <li key={Recipe.id}>
              <div className="RecipesPCard">
                <NavLink to="/#">
                  <div className="RecipeIMG">
                    {/* Note : Tu pourras remplacer l'image fixe par Recipe.image si tu veux afficher la vraie photo */}
                    <img src={Recipe.image} alt={Recipe.title} className="recetteImage" />
                  </div>
                  <div className="Content-Info">
                    <h2 className="Content-Type">{matchCategorie?.name}</h2>
                    <div className="Recipe-Info">
                      <h3>{Recipe.title}</h3>
                      <h4>{matchMovie?.title}</h4>
                      <p>
                        ■■■■□ 4/5 - {Recipe.prepTime}min - {Recipe.difficulty}
                      </p>
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
