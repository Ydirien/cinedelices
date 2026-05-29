import { NavLink } from "react-router-dom";

function recipesOftheDay(){
    return(
        <section className="section-container">
            <div className="RecipeOfTheDay">
                <NavLink to="/#" className={"RecipeOfTheDay-container"}>
                <h2 className="subtitle">Recette du jour</h2>
                    <div className="Recipe-Info">
                        <h2>Polpette à la sauce tomate - Le Parrain </h2>
                        <p>Dans la scène culte, Peter Clemenza enseigne la recette à Michael
                            Corleone avant de lui dire 'Laisse le flingue, prends les cannolis'.
                        </p>
                    </div>
                    <div className="Recipe-img">
                        <img src="../../../public/Logo/LOGO_pricipal_allonger.png" alt="CinéDélices Logo" className="RecipeOfTheDayImg" />
                    </div>
                </NavLink>
            </div>
        </section>
    );
}

export default recipesOftheDay;