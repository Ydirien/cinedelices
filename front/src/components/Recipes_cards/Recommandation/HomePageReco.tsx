import { NavLink } from 'react-router-dom';
import StarsRating from '../Stars/StarsRating';
import { IRecipe } from '../../../../@types/index.d';
interface RecipesReco {
  reco: IRecipe[];
}
export default function RecoHomePage({ reco = [] }: RecipesReco) {
  return (
    <section className="reco-home-page section-container">
      <h2 className="subtitle">Recommandations</h2>

      {/* Le conteneur qui gère le scroll au doigt tout seul */}
      <div className="reco-container">
        {reco.map((recipe) => (
          <div className="Card">
          <NavLink to={`/recettes/${recipe.id}`}>
            <div className="RecipeIMG">
              <img src={recipe.image} alt="image de la recette" className="recetteImage" />
            </div>
            <div className="Recipe-Info">
              <h3>{recipe.title}</h3>
              <h4>{recipe.work.title}</h4>
              <StarsRating />
            </div>
          </NavLink>
        </div>
        ))}
        
      </div>

      <div className="slider-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </section>
  );
}
