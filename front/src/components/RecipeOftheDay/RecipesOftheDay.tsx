import { NavLink } from "react-router-dom";
import { IRecipe } from '../../../../@types/index.d';
interface RecipesOftheDayProps {
  recipe: IRecipe;
}
function recipesOftheDay({ recipe }: RecipesOftheDayProps){
    return(
        <section className="section-container">
            <div className="RecipeOfTheDay">
                <NavLink to="/#" className={"RecipeOfTheDay-container"}>
                <h2 className="subtitle">Recette du jour</h2>
                    <div className="Recipe-Info">
                        <h2>{recipe.title}</h2>
                        <h4>{recipe.work.title}</h4>
                        <p>{recipe.work.synopsis}
                        </p>
                    </div>
                    <div className="Recipe-img">
                        <img src="../../../public/Logo/LOGO_pricipal_allonger.png" alt="CinéDélices Logo" className="RecipeOfTheDayImg" />
                    </div>
                </NavLink>
            </div>
        </section>
    );
}

export default recipesOftheDay;