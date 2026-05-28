import { NavLink } from 'react-router-dom';
import './CategoriesButton.css';
import logoFilms from '../../../assets/logo films.png';
import logoSeries from '../../../assets/logo series.png';
import logoAnimes from '../../../assets/logo naime.png';

function CategoriesButton() {
  const categories = [
    {
      title: 'films',
      url_image: logoFilms,
    },
    { title: 'séries', url_image: logoSeries },
    { title: 'animés', url_image: logoAnimes },
    { title: 'dessin animés' },
  ];
  const types = [{ title: 'entrées' }, { title: 'plats' }, { title: 'desserts' }, { title: 'boissons' }];
  return (
    <>
      <section className="container-test">
        <div className="button-container">
          <h2 className="subtitle">Catégories </h2>
          <section className="section-buttons">
            <div className="category-buttons">
              {categories.map((category) => (
                <NavLink className="category" to={`/${category.title}`}>
                  <div className="button-category">
                    <img src={category.url_image} alt="" />
                  </div>
                </NavLink>
              ))}
            </div>
            <div className="type-buttons">
              {types.map((type) => (
                <NavLink className="type" to={`/${type.title}`}>
                  <div className="button-category">{type.title}</div>
                </NavLink>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export default CategoriesButton;
