import { NavLink } from 'react-router-dom';
import './RecipesStyles.css';
import { IRecipe } from '../../../../@types/index.d';
import StarsRating from '../Stars/StarsRating';

interface RecipesPageCardsProps {
  recipes: IRecipe[];
}

export default function RecipesPageCards({ recipes }: RecipesPageCardsProps) {
  const recipesToDisplay = recipes;

  return (
    <section className="RecipesContainer">
      {/* Remplacement du ul par une div dédiée à la grille */}
      <div className="RecipesGrid">
        {recipesToDisplay.map((recipe) => {
          const work = recipe.work;
          const type = recipe.thematics;

          return (
            /* La clé "key" passe directement sur la carte principale */
            <div className="RecipesPCard" key={recipe.id}>
              <NavLink to={`/recettes/${recipe.id}`}>
                <div className="RecipeIMG">
                  <img src={recipe.image} alt={recipe.title} className="recetteImage" />
                </div>
                <div className="Content-Info">
                  <h2 className="Content-Type">
                    {type?.[0]?.thematic?.name || 'Recette'} - {work.category.name}
                  </h2>
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
          );
        })}
      </div>
    </section>
  );
}