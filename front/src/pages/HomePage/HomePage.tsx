import CategoriesButton from '../../components/Categories/CategoriesButton/CategoriesButton';
import RecoHomePage from '../../components/Recipes_cards/Recommandation/HomePageReco';
import RecipesOftheDay from '../../components/RecipeOftheDay/RecipesOftheDay';
import './homePage.css';
import { IRecipe } from '../../../@types/index.d';

interface HomePageProps {
  recipes: IRecipe[]
}
function HomePage({recipes}: HomePageProps) {
  return (
    <>
      <section className="section-container ">
        <div className="Welcome-div">
          <div className="Welcome-Image">
            <img src="../../../public/Logo/LOGO_debout.png" alt="CinéDélices Logo" className="Welcome-img" />
          </div>
          <div className="welcom-Info">
            <h1 className="welcom-title">Bienvenue sur CinéDélices 🍿</h1>
            <p>
              Que vous soyez fan de grands classiques du cinéma, de séries incontournables, d’anime légendaires ou de
              dessins animés cultes, CinéDélices vous invite à découvrir des recettes inspirées de vos œuvres préférées
              afin d’apporter toute la magie du grand écran directement dans votre assiette. Entre plats iconiques,
              desserts gourmands et boissons emblématiques, plongez dans un univers où la cuisine rencontre la passion
              du cinéma et de la pop culture. 🎬✨
            </p>
          </div>
        </div>
      </section>
      <CategoriesButton />
      <RecipesOftheDay />
      <RecoHomePage />
    </>
  );
}

export default HomePage;
