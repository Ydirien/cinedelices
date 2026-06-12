import CategoriesButton from '../../components/Categories/CategoriesButton/CategoriesButton';
import RecoHomePage from '../../components/Recipes_cards/Recommandation/HomePageReco';
import RecipesOftheDay from '../../components/RecipeOftheDay/RecipesOftheDay';
import './homePage.css';
import { useState, useEffect } from 'react';
import { IRecipe } from '../../../@types/index.d';
import { API_URL } from '../../constants';


function HomePage() {
  const [getAllRecipes, setGetAllrecipes] = useState<IRecipe[]>([]); // recupérer les données de la data recipe en attendants la bdd
  const [showmore,setShowmore] = useState(false)

  //recette du jours (aléatoire pour l'instant)
  const [random, setrandom] = useState(0);
  
  //recommandation (aléatoir aussi)
  const [recommendedRecipes, setRecommendedRecipes] = useState<IRecipe[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const resRecipes = await fetch(`${API_URL}/api/recipes`);
        const dataRecipes = await resRecipes.json();
        setGetAllrecipes(dataRecipes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
      }
    }
    fetchData();
  }, []);
  
  useEffect(() => {
    if (getAllRecipes.length > 0) {
      setrandom(Math.floor(Math.random() * getAllRecipes.length));
    }
  }, [getAllRecipes]);

  useEffect(() => {
    if (getAllRecipes.length >= 3) {
      const recoSetter = [...getAllRecipes].sort(() => Math.random() - 0.5);
      setRecommendedRecipes(recoSetter.slice(0, 3));
    }
  }, [getAllRecipes]);

  if (!getAllRecipes) return <p>Chargement...</p>;
  return (
    <>
      <section className="section-container ">
        <div className="Welcome-div">
          <div className="Welcome-Image">
            <img src="../../../public/Logo/LOGO_principal_v2.png" alt="CinéDélices Logo" className="Welcome-img" />
          </div>
          <div className="welcom-Info">
            <h1 className="welcom-title">Bienvenue sur CinéDélices</h1>
            {!showmore ? 
            <p>
              Que vous soyez fan de grands classiques du cinéma, de séries incontournables, <button className="showmore" onClick={() =>setShowmore(true)}>voir plus</button>
            </p> : <p>
              Que vous soyez fan de grands classiques du cinéma, de séries incontournables, d’anime légendaires ou de
              dessins animés cultes, CinéDélices vous invite à découvrir des recettes inspirées de vos œuvres préférées
              afin d’apporter toute la magie du grand écran directement dans votre assiette. <button className="showmore" onClick={() =>setShowmore(false)}>voir moins</button>
            </p>}
            
          </div>
        </div>
      </section>
      <CategoriesButton />
      {getAllRecipes[random] && <RecipesOftheDay recipe={getAllRecipes[random]} />}
      {getAllRecipes && <RecoHomePage reco={recommendedRecipes} />}
    </>
  );
}

export default HomePage;
