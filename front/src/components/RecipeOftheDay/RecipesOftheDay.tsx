import { NavLink } from "react-router-dom";

function recipesOftheDay(){
    return(
        <section className="RecipeOfTheDay">
            <NavLink to="/#" className={"RecipeOfTheDay-container"}>
                <div className="Recipe-Info">
                    <h1>Recette du jour</h1>
                    <h2>Polpette à la sauce tomate - Le Parrain </h2>
                    <p>Dans la scène culte, Peter Clemenza enseigne la recette à Michael 
                        Corleone avant de lui dire 'Laisse le flingue, prends les cannolis'.
                    </p> 
                </div>
                <div className="Recipe-img">
                    <img src="../../../public/Logo/LOGO_pricipal_allonger.png" alt="CinéDélices Logo" className="RecipeOfTheDayImg" />
                </div>
            </NavLink>
        </section>
    );
}

export default recipesOftheDay;