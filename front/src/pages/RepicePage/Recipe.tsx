import './Recipe.css';
import StarsRating from '../../components/Recipes_cards/Stars/StarsRating';
import { GiCook } from 'react-icons/gi';
import { IoTimer } from 'react-icons/io5';
import { BiSolidFilm } from 'react-icons/bi';
import { BsForkKnife } from 'react-icons/bs';

import { useState } from 'react';
function RecipePage() {
  const [NavSwitch, SetNav] = useState(1);

  return (
    <div className="RecipePage">
      <section className="RecipeImage">
        <img src="/recipes-picture/Bœuf bowl façon Food Wars.png" alt="" />
      </section>
      <section className="Info">
        <h2>Nom de la recette</h2>
        <h4>Film associe</h4>
        <StarsRating />
        <p>
          Dans la scène culte, Peter Clemenza enseigne la recette à Michael Corleone avant de lui dire : "Laisse le
          flingue, prends les cannolis".
        </p>
        <ul className="Recipe-Info">
          <li>
            <IoTimer size={22} />
            <span>20 min</span>
          </li>
          <li>
            <GiCook size={22} />
            <span>Facile</span>
          </li>
          <li>
            <BiSolidFilm size={22} />
            <span>Film</span>
          </li>

          <li>
            <BsForkKnife size={20} />
            <span>4 pers.</span>
          </li>
        </ul>
      </section>
      <section className="Nav">
        <button
          onClick={() => SetNav(1)}
          style={{
            color: NavSwitch == 1 ? 'var(--quinary-color)' : 'var( --tertiary-color)',
            borderColor: NavSwitch == 1 ? 'var(--quinary-color)' : 'var( --tertiary-color)',
          }}
        >
          Ingrédients
        </button>
        <button
          onClick={() => SetNav(2)}
          style={{
            color: NavSwitch == 2 ? 'var(--quinary-color)' : 'var( --tertiary-color)',
            borderColor: NavSwitch == 2 ? 'var(--quinary-color)' : 'var( --tertiary-color)',
          }}
        >
          Steps
        </button>
        <button
          onClick={() => SetNav(3)}
          style={{
            color: NavSwitch == 3 ? 'var(--quinary-color)' : 'var( --tertiary-color)',
            borderColor: NavSwitch == 3 ? 'var(--quinary-color)' : 'var( --tertiary-color)',
          }}
        >
          Avis
        </button>
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
      {NavSwitch == 3 && (
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
            <input type="text" placeholder="Laissez un commentaire..." className="CommentInput" />
            <button type="submit" className="CommentButton">
              Envoyer
            </button>
          </form>
        </section>
      )}

      <section className="Opinion"></section>
    </div>
  );
}

export default RecipePage;
