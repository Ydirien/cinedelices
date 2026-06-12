import './Recipe.css';
import { API_URL } from '../../constants';
import { IRecipeDetail } from '../../../@types/index.d';
import { LuClock, LuChefHat, LuFilm, LuUtensils, LuStar } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';

const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: 'Facile',
  MEDIUM: 'Moyen',
  HARD: 'Difficile',
};

function imgUrl(path: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_URL}/${path}`;
}

function RecipePage() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);
  const { recette } = useParams();
  const [recipe, setRecipe] = useState<IRecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [score, setScore] = useState(5);
  const [errorPopup, setErrorPopup] = useState('');

  useEffect(() => {
    if (!errorPopup) return;
    const t = window.setTimeout(() => setErrorPopup(''), 3000);
    return () => window.clearTimeout(t);
  }, [errorPopup]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/recipes/${recette}`);
        const data = await res.json();
        if (!res.ok) { setError('Recette introuvable'); return; }
        setRecipe(data);
      } catch { setError('Impossible de contacter le serveur.'); }
    }
    load();
  }, [recette]);

  useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetch(`${API_URL}/api/recipes/${recette}/comments`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch { /* silencieux */ }
    }
    loadComments();
  }, [recette]);

  async function postComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await apiFetch(`/api/recipes/${recette}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment, score }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorPopup(res.status === 409
          ? 'Vous avez déjà commenté cette recette.'
          : data.message || "Erreur lors de l'envoi.");
        return;
      }
      setComments((prev) => [data, ...prev]);
      setNewComment('');
      setScore(5);
    } catch { setErrorPopup("Impossible d'envoyer le commentaire."); }
  }

  if (error) return <p className="recipe-error">{error}</p>;
  if (!recipe) return <p className="recipe-loading">Chargement…</p>;

  const totalTime = recipe.prepTime + recipe.cookTime;
  const avgRating = comments.length > 0
    ? comments.reduce((sum, c) => sum + c.score, 0) / comments.length
    : null;

  return (
    <div className="recipe-page-bg">
      <div className="recipe-page">
        {errorPopup && (
          <div className="recipe-error-toast">
            <span>✕</span>
            <p>{errorPopup}</p>
          </div>
        )}

        {/* ── HERO ── */}
        <section className="recipe-hero">
          <img
            crossOrigin="anonymous"
            src={imgUrl(recipe.image)}
            alt={recipe.title}
            className="recipe-hero-img"
          />
          <div className="recipe-hero-overlay">
            <div className="recipe-hero-badges">
              <span className="recipe-badge">{recipe.work.category.name}</span>
              {recipe.thematics.map((t) => (
                <span className="recipe-badge recipe-badge--thematic" key={t.thematicId}>
                  {t.thematic.name}
                </span>
              ))}
            </div>
            <h1 className="recipe-hero-title">{recipe.title}</h1>
            <p className="recipe-hero-work">
              Inspiré de <strong>{recipe.work.title}</strong> ({recipe.work.releaseYear})
            </p>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="recipe-body">

          {/* ── SIDEBAR ── */}
          <aside className="recipe-sidebar">
            <div className="recipe-meta-card">
              <div className="recipe-meta-item">
                <LuClock size={20} className="meta-icon" />
                <div>
                  <span className="meta-label">Temps total</span>
                  <span className="meta-value">{totalTime} min</span>
                </div>
              </div>
              <div className="recipe-meta-item">
                <LuClock size={20} className="meta-icon meta-icon--dim" />
                <div>
                  <span className="meta-label">Préparation</span>
                  <span className="meta-value">{recipe.prepTime} min</span>
                </div>
              </div>
              <div className="recipe-meta-item">
                <LuChefHat size={20} className="meta-icon" />
                <div>
                  <span className="meta-label">Difficulté</span>
                  <span className="meta-value">{DIFFICULTY_LABEL[recipe.difficulty] ?? recipe.difficulty}</span>
                </div>
              </div>
              <div className="recipe-meta-item">
                <LuUtensils size={18} className="meta-icon" />
                <div>
                  <span className="meta-label">Portions</span>
                  <span className="meta-value">{recipe.servings} personne{recipe.servings > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="recipe-meta-item">
                <LuFilm size={20} className="meta-icon" />
                <div>
                  <span className="meta-label">Catégorie</span>
                  <span className="meta-value">{recipe.work.category.name}</span>
                </div>
              </div>
            </div>

            {/* Note moyenne */}
            <div className="recipe-rating-card">
              <LuStar size={18} className="rating-icon" />
              {avgRating !== null ? (
                <div className="rating-content">
                  <span className="rating-value">{avgRating.toFixed(1)}<span className="rating-max"> / 5</span></span>
                  <span className="rating-stars">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
                  <span className="rating-count">{comments.length} avis</span>
                </div>
              ) : (
                <div className="rating-content">
                  <span className="rating-empty">Aucun avis</span>
                </div>
              )}
            </div>

          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="recipe-main">
            <p className="recipe-description">{recipe.description}</p>

            {/* Tabs */}
            <div className="recipe-tabs" role="tablist">
              {([
                [1, 'Ingrédients', recipe.recipeIngredients.length],
                [2, 'Étapes', recipe.steps.length],
                [3, 'Avis', comments.length],
              ] as const).map(([id, label, count]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeTab === id}
                  className={`recipe-tab${activeTab === id ? ' recipe-tab--active' : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  {label}
                  <span className="recipe-tab-count">{count}</span>
                </button>
              ))}
            </div>

            {/* ── INGRÉDIENTS ── */}
            {activeTab === 1 && (
              <ul className="ingredients-grid">
                {recipe.recipeIngredients.map((ing) => (
                  <li key={ing.id} className="ingredient-card">
                    <span className="ingredient-qty">{ing.quantity} {ing.unit}</span>
                    <span className="ingredient-name">{ing.ingredient.name}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* ── ÉTAPES ── */}
            {activeTab === 2 && (
              <ol className="steps-list">
                {recipe.steps
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                    <li key={step.id} className="step-card">
                      <span className="step-number">{step.order}</span>
                      <p className="step-content">{step.content}</p>
                    </li>
                  ))}
              </ol>
            )}

            {/* ── AVIS ── */}
            {activeTab === 3 && (
              <div className="comments-section">
                {comments.length === 0 ? (
                  <p className="comments-empty">Aucun avis pour l'instant. Soyez le premier !</p>
                ) : (
                  <div className="comments-list">
                    {comments.map((c) => (
                      <article key={c.id} className="comment-card">
                        <div className="comment-header">
                          <span className="comment-author">{c.user?.username ?? 'Anonyme'}</span>
                          <span className="comment-stars">
                            {'★'.repeat(c.score)}{'☆'.repeat(5 - c.score)}
                          </span>
                        </div>
                        <p className="comment-text">{c.content}</p>
                      </article>
                    ))}
                  </div>
                )}

                <form className="comment-form" onSubmit={postComment}>
                  <input
                    type="text"
                    placeholder="Partagez votre avis sur cette recette…"
                    className="comment-input"
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="comment-form-actions">
                    <select
                      value={score}
                      className="comment-score"
                      onChange={(e) => setScore(Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{'★'.repeat(n)}</option>
                      ))}
                    </select>
                    <button type="submit" className="comment-submit">
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
