import "./Recipe.css"
import { useState } from "react";
function RecipePage() {
   const [NavSwitch, SetNav] = useState(1);

  return (
   <div className="RecipePage">
      <section className="RecipeImage">
          <img src="/recipes-picture/Bœuf bowl façon Food Wars.png" alt="" />
      </section>
      <section className="Info">
        <h2>Nom de la recette</h2>
        <h4>Film associé</h4>
        <div className="Stars">★★★★☆ (4/5)</div>
        <p>
          Dans la scène culte, Peter Clemenza enseigne la recette à Michael Corleone avant de lui dire :
          "Laisse le flingue, prends les cannolis".
        </p>
        <ul className="Recipe-Info">
        <li>
            <img src="/icons/time.svg" alt="" />
            <span>20 min</span>
        </li>
        <li>
            <img src="/icons/level.svg" alt="" />
            <span>Facile</span>
        </li>
        <li>
            <img src="/icons/movie.svg" alt="" />
            <span>Film</span>
        </li>

        <li>
            <img src="/icons/people.svg" alt="" />
            <span>4 pers.</span>
        </li>
        </ul>
      </section>
      <section className="Nav">
        <button onClick={()=> SetNav(1)} style={{color: NavSwitch == 1? 'var' : 'var(--tertiary-color)'}}>Ingrédients</button>
        <button onClick={()=> SetNav(2)}>Steps</button>
        <button onClick={()=> SetNav(3)}>Avis</button>
      </section>
      {NavSwitch == 1 && (
        <section className="Ingredients">
        <div className="List">
          <ul>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
            <li>500g de viande hachée mixte (bœuf + porc)</li>
         </ul>
        </div>
      </section>
      )}
      {NavSwitch == 2 && (
        
      <section className="Steps">
        <div className="List">
          <ul>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
         </ul>
        </div>
      </section>
      )}
      {NavSwitch == 3 &&(
         <section className="Comments">
        <div className="List">
          <article className="Comment">
            <div className="CommentHeader">
              <h4>NIB</h4>
              <div className="Stars">★★★★☆</div>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </article>
          <article className="Comment">
            <div className="CommentHeader">
              <h4>NIB</h4>
              <div className="Stars">★★★★☆</div>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </article>
          <article className="Comment">
            <div className="CommentHeader">
              <h4>NIB</h4>
              <div className="Stars">★★★★☆</div>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </article>
          <article className="Comment">
            <div className="CommentHeader">
              <h4>NIB</h4>
              <div className="Stars">★★★★☆</div>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </article>
          <article className="Comment">
            <div className="CommentHeader">
              <h4>NIB</h4>
              <div className="Stars">★★★★☆</div>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </article>
        </div>
        <form className="CommentForm">
          <input type="text" placeholder="Laissez un commentaire..." className="CommentInput"/>
          <button type="submit" className="CommentButton">Envoyer</button>
        </form>
      </section>
      )}
     
      <section className="Opinion">
        
      </section>
   </div>
  );
}

export default RecipePage;
