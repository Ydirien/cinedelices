import CategoriesButton from '../../components/categories/categoriesButton/CategoriesButton';
import RecoHomePage from '../../components/Recettes_cards/recommandation/HomePageReco';
import RecipesOftheDay from '../../components/RecipeOftheDay/RecipesOftheDay';
import './homePage.css';
function HomePage(){
  return(
    <main>
      <RecipesOftheDay/>
      <CategoriesButton/>
      <RecoHomePage/>
    </main>
);}

export default HomePage