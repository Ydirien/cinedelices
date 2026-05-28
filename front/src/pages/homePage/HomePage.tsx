import CategoriesButton from '../../components/categories/categoriesButton/CategoriesButton';
import RecoHomePage from '../../components/Recettes_cards/recommandation/HomePageReco';
import RecipesOftheDay from '../../components/RecipeOftheDay/RecipesOftheDay';
import './homePage.css';
function HomePage() {
  return (
    <main>
      <section className="Welcome-Section">
        <div className="Welcome-Image">
          <img src="../../../public/Logo/LOGO_debout.png" alt="CinéDélices Logo" className="Welcome-img" />
        </div>
        <div className="Recipe-Info">
          <h1>Bienvenue sur CinéDélices 🍿</h1>
          <p>
            Que vous soyez fan de grands classiques du cinéma, de séries incontournables, d’anime légendaires ou de
            dessins animés cultes, CinéDélices vous invite à découvrir des recettes inspirées de vos œuvres préférées
            afin d’apporter toute la magie du grand écran directement dans votre assiette. Entre plats iconiques,
            desserts gourmands et boissons emblématiques, plongez dans un univers où la cuisine rencontre la passion du
            cinéma et de la pop culture. 🎬✨
          </p>
        </div>
      </section>
      <CategoriesButton />
      <RecipesOftheDay />
      <RecoHomePage />
    </main>
  );
}

export default HomePage;
