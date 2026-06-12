import { NavLink } from 'react-router-dom';
import './RecipesStyles.css';
import { IRecipe } from '../../../../@types/index.d';
import StarsRating from '../Stars/StarsRating';
import { Difficulty } from '@prisma/client';
import { API_URL } from '../../../constants';

interface RecipesPageCardsProps {
  recipes: IRecipe[];
}

export default function RecipesPageCards({ recipes }: RecipesPageCardsProps) {
  const recipesToDisplay = recipes;
  // objet pour recuperer les difficulty afin de les traduir en fr
  const difficultyLabels: Record<Difficulty, string> = {
    EASY: 'Facile',
    MEDIUM: 'Moyen',
    HARD: 'Difficile',
  };

  return (
    <section className="RecipeGrid">
      <h2 className="title-page">Recettes</h2>
      {/* Remplacement du ul par une div dédiée à la grille */}
      <div className="RecipesGrid">
        {recipesToDisplay.map((recipe) => {
          const work = recipe.work;
          const type = recipe.thematics;

          return (
            /* La clé "key" passe directement sur la carte principale */
            <div className="RecipesPCard" key={recipe.id}>
              <NavLink to={`/recettes/${recipe.id}`}>
              <h2 className="Content-Type">
                    {type?.[0]?.thematic?.name || 'Recette'} - {work.category.name}
                  </h2>
                <div className="RecipeIMG">
                  <img crossOrigin='anonymous' src={recipe.image.startsWith('http') ? recipe.image : `${API_URL}/${recipe.image}`} alt={recipe.title} className="recetteImage" />
                </div>
                 <div className="Recipe-Info">
                    <h3>{recipe.title}</h3>
                    <h4>{work.title}</h4>
                    <div className="Rating">
                      <StarsRating />
                      <p>
                        - {recipe.prepTime}min - {difficultyLabels[recipe.difficulty] || recipe.difficulty}
                      </p>
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
