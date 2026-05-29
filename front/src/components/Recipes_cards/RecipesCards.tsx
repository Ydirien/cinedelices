import { NavLink } from "react-router-dom";

function RecipesCards (){
  return(
    <div className="container-recipes">
      <NavLink to="/#">
            <div className="RecipeIMG">
              <img
                src="../../../public/Logo/LOGO_pricipal_allonger.png"
                alt="image de la recette"
                className="recetteImage"
              />
            </div>
            <div className="Recipe-Info">
              <h3>Cannolis siciliens</h3>
              <h4>Le parain</h4>
              <p>■■■■□ 4/5 - 30min - facile</p>
            </div>
          </NavLink>
    </div>
  )
}