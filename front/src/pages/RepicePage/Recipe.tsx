import "./Recipe.css"
function RecipePage() {
  return (
   <div>
      <section className="RecipeImage">
          <img src="/Logo/LOGO_pricipal_allonger.png" alt="" />
      </section>
      <section className="Info">
        <h2>Nom de la recette</h2>
        <h4>Film associé</h4>
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
        <button>Ingrédients</button>
        <button>Steps</button>
        <button>Avis</button>
      </section>
      <section className="Ingredients">
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
         </ul>
      </section>

      <section className="Steps">
          <ul>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
            <li>Mélanger la viande, les œufs, le parmesan</li>
         </ul>
      </section>
      <section className="Comments">
        <article className="Comment">
          <div className="CommentHeader">
            <img src="/icons/user.svg" alt="" />
            <div>
              <h4>NIB</h4>
              <div className="Stars">★★★★☆</div>
            </div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        </article>
          <form className="CommentForm">
            <input type="text" placeholder="Laissez un commentaire..." className="CommentInput"/>
            <button type="submit" className="CommentButton">Envoyer</button>
          </form>
        </section>
      <section className="Opinion">
        
      </section>
   </div>
  );
}

export default RecipePage;
