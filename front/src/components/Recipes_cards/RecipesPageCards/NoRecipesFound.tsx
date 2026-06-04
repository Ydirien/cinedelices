
import './RecipesStyles.css';

export default function NoRecipePage() {

  return (
    <section className="RecipesContainer">
      <div className="RecipesPCard">
                <div className="RecipeIMG">
                    <img src="https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg" alt="recipe not found" className="recetteImage" />
                </div>
                <div className="Content-Info">
                  <div className="Recipe-Info">
                    <h3>Recipe not found</h3>
                  </div>
                </div>
        </div>
    </section>
  );
}
