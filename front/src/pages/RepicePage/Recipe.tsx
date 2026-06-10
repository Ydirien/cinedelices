import './Recipe.css';
import { API_URL } from '../../constants';
import { IRecipeDetail } from '../../../@types/index.d';
import StarsRating from '../../components/Recipes_cards/Stars/StarsRating';
import { GiCook } from 'react-icons/gi';
import { IoTimer } from 'react-icons/io5';
import { BiSolidFilm } from 'react-icons/bi';
import { BsForkKnife } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RecipePage() {
  const [NavSwitch, SetNav] = useState(1);
  const { recette } = useParams();
  const [recipe, setRecipe] = useState<IRecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function getRecipeById() {
      try {
        const response = await fetch(`${API_URL}/api/recipes/${recette}`);
        const data = await response.json();
        console.log('recette:', data);
        if (!response.ok) {
          setError(`Erreur ${response.status} : ${data.message ?? 'Recette introuvable'}`);
          return;
        }
        setRecipe(data);
        console.log("image url:", data.image);

      } catch (err) {
        console.error('Fetch échoué :', err);
        setError('Impossible de contacter le serveur.');
      }
    }
    getRecipeById();
  }, [recette]);

  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Chargement...</p>;

  return (
    <div className="RecipePage">
      <section className="RecipeImage">
        <img crossOrigin='anonymous' src={recipe.image.includes("upload") ? API_URL+"/"+recipe.image : recipe.image} alt="" />
      </section>
      <section className="Info">
        <h2>{recipe.title}</h2>
        <h4>{recipe.work.title}</h4>
        <StarsRating />
        <p>{recipe.work.synopsis}</p>
        <ul className="Recipe-Info">
          <li>
            <IoTimer size={22} />
            <span>{recipe.prepTime} min</span>
          </li>
          <li>
            <GiCook size={22} />
            <span>{recipe.difficulty}</span>
          </li>
          <li>
            <BiSolidFilm size={22} />
            <span>{recipe.work.category.name}</span>
          </li>

          <li>
            <BsForkKnife size={20} />
            <span>{recipe.servings} pers.</span>
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
              {recipe.recipeIngredients.map((Ingredient) => (
                <li key={Ingredient.id}>
                  <span>
                    {Ingredient.quantity} {Ingredient.unit} -{' '}
                  </span>
                  <span> {Ingredient.ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {NavSwitch == 2 && (
        <section className="Steps">
          <div className="List">
            <ul>
              {recipe.steps.map((step) => (
                <li key={step.id}>
                  <span>{step.order} - </span>
                  <span> {step.content}</span>
                </li>
              ))}
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
              <p>Les chocolatine c'est mieux que le capitalisme</p>
            </article>
            <article className="Comment">
              <div className="CommentHeader">
                <h4> Romain Hoff.</h4>
                <div className="Stars">★★★★☆</div>
              </div>
              <p>
                Hoff... les chocolatine c'est qu'une dockerisation du pain au chocolat, de toute façon je suis legitime!
              </p>
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
