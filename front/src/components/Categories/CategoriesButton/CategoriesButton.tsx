import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './CategoriesButton.css';
import logoFilms from '../../../assets/Logo-categories/logo-films.png';
import logoSeries from '../../../assets/Logo-categories/logo-series.png';
import logoAnimes from '../../../assets/Logo-categories/logo-naime.png';
import logoEntrees from '../../../assets/Logo-types/logo-entrees.png';
import logoDesserts from '../../../assets/Logo-types/logo-desserts.png';



function CategoriesButton() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    const el = carouselRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    updateArrows();

    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);

    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  const categories = [
    { title: 'film', url_image: logoFilms , id: 1},
    { title: 'serie', url_image: logoSeries, id: 2},
    { title: 'Manga / Anime', url_image: logoAnimes, id: 3},
  ];

const types = [
  { title: 'Entrée', url_image: logoEntrees, id: 1},
  { title: 'Plat', url_image: logoEntrees, id: 2},
  { title: 'Dessert', url_image: logoDesserts, id: 3},
  { title: 'Boisson', url_image: logoEntrees, id: 4},
];

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth',
    });
  };

  return (
    
      <section className="section-container">
        <div className="button-container">
          <h2 className="subtitle">Catégories </h2>
          <div className="carousel-wrapper">
            <button className={`carousel-arrow carousel-arrow--left ${showLeft ? 'visible' : ''}`} onClick={() => scroll('left')} aria-label="Précédent">
              &#8249;
            </button>
            <div className="section-buttons" ref={carouselRef}>
              {/* button categories (films, series, anime, dessin animes) */}
              <div className="category-buttons">
                {categories.map((category) => (
                  <NavLink key={category.title} className="category" to={`/recettes?category=${category.title}`}>
                    <div className="button-category">
                      <img src={category.url_image} alt={category.title} />
                    </div>
                  </NavLink>
                ))}
              </div>
              {/* buttons type (entrées, plats, desserts, boissons) */}
              <div className="type-buttons">
                {types.map((type) => (
                  <NavLink key={type.title} className="type" to={`/recettes?thematic=${type.title}`}>
                    <div className="button-category">
                      <img src={type.url_image} alt={type.title} /></div>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <button
            className={`carousel-arrow carousel-arrow--right ${showRight ? 'visible' : ''}`}
            onClick={() => scroll('right')}
            aria-label="Suivant"
          >
            &#8250;
          </button>
        </div>
      </section>
  );
}

export default CategoriesButton;