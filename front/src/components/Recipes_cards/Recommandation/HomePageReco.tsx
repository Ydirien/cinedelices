import { NavLink } from 'react-router-dom';
import { useState, useRef } from 'react';
import StarsRating from '../Stars/StarsRating';
import { IRecipe } from '../../../../@types/index.d';

interface RecipesRecoProps {
  recipes: IRecipe[]; // "reco" est un tableau de recettes
}

export default function RecoHomePage({ reco }: RecipesRecoProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fonction pour détecter quelle carte est visible au scroll
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;

    // On calcule l'index de la carte actuellement centrée/visible
    const index = Math.round(scrollLeft / containerWidth);
    
    // Sécurité pour ne pas dépasser le tableau de recettes
    if (index >= 0 && index < reco.length) {
      setActiveIndex(index);
    }
  };

  return (
    <section className="reco-home-page">
      <h2 className="subtitle">Recommandations</h2>

      {/* On ajoute la ref et l'écouteur de Scroll ici */}
      <div 
        className="reco-container" 
        ref={containerRef} 
        onScroll={handleScroll}
      >
        {reco.map((recipe) => (
          <div className="Card" key={recipe.id}>
            <NavLink to={`/recettes/${recipe.id}`}>
              <div className="RecipeIMG">
                <img src={recipe.image} alt={recipe.title} className="recetteImage" />
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
      {/* Génération dynamique des dots en fonction du nombre de recettes */}
      <div className="slider-dots">
        {reco.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === activeIndex ? 'active' : ''}`}
          ></span>
        ))}
      </div>
    </section>
  );
}