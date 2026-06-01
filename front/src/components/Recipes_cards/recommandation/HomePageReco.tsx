import { NavLink } from 'react-router-dom';

export default function RecoHomePage() {
  return (
    <section className="reco-home-page">
      <h2 className='subtitle'>Recommandations</h2>
      
      {/* Le conteneur qui gère le scroll au doigt tout seul */}
      <div className="reco-container">
        
        {/* Carte 1 */}
        <div className="Card">
          <NavLink to="/#">
            <div className="RecipeIMG">
              <img
                src="/Logo/LOGO_pricipal_allonger.png" 
                alt="image de la recette"
                className="recetteImage"
              />
            </div>
            <div className="Recipe-Info">
              <h3>Cannolis siciliens</h3>
              <h4>Le parrain</h4>
              <p>■■■■□ 4/5 - 30min - facile</p>
            </div>
          </NavLink>
        </div>

        {/* Carte 2 */}
        <div className="Card">
          <NavLink to="/#">
            <div className="RecipeIMG">
              <img
                src="/Logo/LOGO_pricipal_allonger.png"
                alt="image de la recette"
                className="recetteImage"
              />
            </div>
            <div className="Recipe-Info">
              <h3>Cannolis siciliens</h3>
              <h4>Le parrain</h4>
              <p>■■■■□ 4/5 - 30min - facile</p>
            </div>
          </NavLink>
        </div>

        {/* Carte 3 */}
        <div className="Card">
          <NavLink to="/#">
            <div className="RecipeIMG">
              <img
                src="/Logo/LOGO_pricipal_allonger.png"
                alt="image de la recette"
                className="recetteImage"
              />
            </div>
            <div className="Recipe-Info">
              <h3>Cannolis siciliens</h3>
              <h4>Le parrain</h4>
              <p>■■■■□ 4/5 - 30min - facile</p>
            </div>
          </NavLink>
        </div>

      </div>

      <div className="slider-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </section>
  );
}
