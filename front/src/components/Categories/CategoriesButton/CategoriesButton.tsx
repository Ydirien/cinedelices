import { useEffect, useRef, useState } from 'react';
import { NavLink, useFetcher } from 'react-router-dom';
import './CategoriesButton.css';
import logoFilms from '../../../assets/Logo-categories/logo-films.png';
import logoSeries from '../../../assets/Logo-categories/logo-series.png';
import logoAnimes from '../../../assets/Logo-categories/logo-naime.png';
import logoEntrees from '../../../assets/Logo-types/logo-entrees.png';
import logoDesserts from '../../../assets/Logo-types/logo-desserts.png';
import { ICategory, IType } from '../../../../@types/index.d';
import { API_URL } from '../../../constants';

function CategoriesButton() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [getAllCategories, setGetAllCategories] = useState<ICategory[]>([]);
  const [getAllTypes, setGetAllTypes] = useState<IType[]>([]);

  const updateArrows = () => {
    const el = carouselRef.current;
    if (!el) return;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  useEffect(() => {
    async function fetchDataCategoriesAndTypes() {
      try {
        const resCategories = await fetch(`${API_URL}/api/categories`);
        const resTypes = await fetch(`${API_URL}/api/types`);
        const dataCategories = await resCategories.json();
        const dataTypes = await resTypes.json();
        setGetAllCategories(dataCategories);
        setGetAllTypes(dataTypes);
      } catch (error) {
        console.error('Erreur lors du chargement des bouttons :', error);
      }
    }
    fetchDataCategoriesAndTypes();
  }, []);

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

  useEffect(() => {});

  const categoryImages: Record<string, string> = {
    Film: logoFilms,
    Série: logoSeries,
    'Manga / Anime': logoAnimes,
  };

  const typeImages: Record<string, string> = {
    Entrée: logoEntrees,
    Plat: logoEntrees,
    Dessert: logoDesserts,
    Boisson: logoEntrees,
  };

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
          <button
            className={`carousel-arrow carousel-arrow--left ${showLeft ? 'visible' : ''}`}
            onClick={() => scroll('left')}
            aria-label="Précédent"
          >
            &#8249;
          </button>
          <div className="section-buttons" ref={carouselRef}>
            {/* button categories (films, series, anime, dessin animes) */}
            <div className="category-buttons">
              {getAllCategories.map((category) => (
                <NavLink key={category.name} className="category" to={`/recettes?category=${category.name}`}>
                  <div className="button-category">
                    <img src={categoryImages[category.name]} alt={category.name} />
                  </div>
                </NavLink>
              ))}
            </div>
            {/* buttons type (entrées, plats, desserts, boissons) */}
            <div className="type-buttons">
              {getAllTypes.map((type) => (
                <NavLink key={type.name} className="type" to={`/recettes?thematic=${type.name}`}>
                  <div className="button-category">
                    <img src={typeImages[type.name]} alt={type.name} />
                  </div>
                </NavLink>
              ))}
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
      </div>
    </section>
  );
}

export default CategoriesButton;
