import './MentionsPage.css';

function MentionsPage() {
    return (
        <main className="legal-page">
      <div className="legal-container">
        <div className="legal-content">
          <h1>Mentions légales</h1>

          <section>
            <h2>Éditeur du site</h2>
            <p>
              CinéDélice est un projet pédagogique réalisé dans le cadre de la
              formation Développeur Concepteur d’Applications.
            </p>
          </section>

          <section>
            <h2>Responsables du projet</h2>
            <p>
              L’équipe projet est composée de Angelo, Jordan, Kilian, Gaëtan et
              Thibault.
            </p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>
              Ce projet est développé à des fins pédagogiques et n’est pas
              destiné à une exploitation commerciale.
            </p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              Les références aux films, séries, animés et dessins animés
              appartiennent à leurs auteurs et ayants droit respectifs.
            </p>
          </section>

          <section>
            <h2>Données personnelles</h2>
            <p>
              Les données éventuellement collectées sont utilisées uniquement
              dans le cadre du fonctionnement de l’application.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default MentionsPage;