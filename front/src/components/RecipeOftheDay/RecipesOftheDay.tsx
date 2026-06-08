import { NavLink } from 'react-router-dom';
import { IRecipe } from '../../../../@types/index.d';
interface RecipesOftheDayProps {
  recipe: IRecipe;
}
function recipesOftheDay({ recipe }: RecipesOftheDayProps) {
  return (
    <section className="section-container">
      <h2 className="subtitle">Recette du jour</h2>
      <div className="RecipeOfTheDay">
        <NavLink to={`/recettes/${recipe.id}`} className={'RecipeOfTheDay-container'}>
          <div className="img-container">
            <img src={recipe.image} alt="CinéDélices Logo" className="RecipeOfTheDayImg" />
          </div>
          <div className="Recipe-Info">
            <h2>{recipe.title}</h2>
            <h4>{recipe.work.title}</h4>
            <p>{recipe.work.synopsis}</p>
          </div>

          <div className="Recipe-img"></div>
        </NavLink>
      </div>
    </section>
  );
}

export default recipesOftheDay;
