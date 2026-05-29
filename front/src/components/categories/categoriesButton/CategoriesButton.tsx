import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './CategoriesButton.css';
import logoFilms from '../../../assets/logo films.png';
import logoSeries from '../../../assets/logo series.png';
import logoAnimes from '../../../assets/logo naime.png';
import logoEntrees from '../../../assets/logo-entrees.png';



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
    { title: 'films', url_image: logoFilms },
    { title: 'séries', url_image: logoSeries },
    { title: 'animés', url_image: logoAnimes },
    { title: 'dessin animés' },
  ];
  const types = [{ title: 'entrées', url_image: logoEntrees }, { title: 'plats' }, { title: 'desserts' }, { title: 'boissons' }];

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="container-test">
        <div className="button-container">
          <h2 className="subtitle">Catégories </h2>
          <div className="carousel-wrapper">
            <button className={`carousel-arrow carousel-arrow--left ${showLeft ? 'visible' : ''}`} onClick={() => scroll('left')} aria-label="Précédent">
              &#8249;
            </button>
            <div className="section-buttons" ref={carouselRef}>
              <div className="category-buttons">
                {categories.map((category) => (
                  <NavLink key={category.title} className="category" to={`/${category.title}`}>
                    <div className="button-category">
                      <img src={category.url_image} alt={category.title} />
                    </div>
                  </NavLink>
                ))}
              </div>
              {/* buttons type (entrées, plats, desserts, boissons) */}
              <div className="type-buttons">
                {types.map((type) => (
                  <NavLink key={type.title} className="type" to={`/${type.title}`}>
                    <div className="button-category">
                      <img src={type.url_image} alt={type.title} /></div>
                  </NavLink>
                ))}
              </div>
            </div>
            <button className={`carousel-arrow carousel-arrow--right ${showRight ? 'visible' : ''}`} onClick={() => scroll('right')} aria-label="Suivant">
              &#8250;
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default CategoriesButton;
