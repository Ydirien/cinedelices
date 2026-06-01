import { NavLink } from "react-router-dom";
import './RecipesStyles.css'
import { useState, useEffect } from "react";

import Recipes from '../../../../data/recipe.json'
import Work from'../../../../data/works.json';
import Categories from'../../../../data/categories.json';

export default function RecipesPageCards (){
  return(
      <section className="RecipesContainer">
         <ul>
            {Recipes.map((Recipe)=>{
              const matchMovie = Work.find((work) => work.id === Recipe.workId)
              const matchCategorie = Categories.find((Categorie) => Categorie.id === matchMovie?.categoryId)
              return(
                  <li key={Recipe.id}>
                <div className="RecipesPCard">
          <NavLink to="/#">
            <div className="RecipeIMG">
              <img
                src="/Logo/LOGO_pricipal_allonger.png" 
                alt="image de la recette"
                className="recetteImage"
              />
            </div>
            <div className="Content-Info">
              <h2 className="Content-Type">{matchCategorie?.name}</h2>
              <div className="Recipe-Info">
                <h3>{Recipe.title}</h3>
                <h4>{matchMovie?.title}</h4>
                <p>■■■■□ 4/5 - {Recipe.prepTime}min - {Recipe.difficulty}</p>
              </div>
            </div>
          </NavLink>
        </div>
              </li>
              );
            })}
         </ul>
      </section>
  )
}