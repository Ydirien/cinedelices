/**
 * Tests d'intégration des routes recettes.
 * Couvre la lecture publique, la création (multipart), les likes et les commentaires.
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../../src/app.ts';
import { prisma } from '../../src/models/index.ts';
import { testData } from '../config/global-setup.ts';
import {
  createUser,
  createAdmin,
  createRecipe,
  bearerHeader,
  uniqueEmail,
} from '../helpers/test-helpers.ts';

// ──────────────────────────────────────────────────
// GET /api/recipes
// ──────────────────────────────────────────────────

describe('GET /api/recipes', () => {
  let approvedTitle: string;
  let pendingTitle: string;

  before(async () => {
    const user = await createUser();
    approvedTitle = `Recette approuvée ${Date.now()}`;
    pendingTitle = `Recette en attente ${Date.now()}`;

    await createRecipe(user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id, {
      title: approvedTitle,
      state: 'APPROVED',
    });
    await createRecipe(user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id, {
      title: pendingTitle,
      state: 'PENDING',
    });
  });

  it('retourne 200 avec une liste paginée', async () => {
    const res = await request(app).get('/api/recipes');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data), 'data doit être un tableau');
    assert.ok(typeof res.body.total === 'number', 'total doit être un nombre');
  });

  it('ne retourne que les recettes APPROVED (pas PENDING ni REJECTED)', async () => {
    const res = await request(app).get('/api/recipes');
    assert.equal(res.status, 200);

    const titles = res.body.data.map((r: any) => r.title);
    assert.ok(
      !titles.includes(pendingTitle),
      'les recettes PENDING ne doivent pas apparaître dans la liste publique',
    );
  });

  it('filtre par difficulté', async () => {
    const res = await request(app).get('/api/recipes?difficulty=EASY');
    assert.equal(res.status, 200);
    for (const recipe of res.body.data) {
      assert.equal(recipe.difficulty, 'EASY', 'seules les recettes EASY doivent être retournées');
    }
  });

  it('respecte la pagination (limit et page)', async () => {
    const res = await request(app).get('/api/recipes?limit=2&page=1');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.length <= 2, 'le nombre de résultats ne doit pas dépasser le limit');
    assert.equal(res.body.limit, 2);
  });
});

// ──────────────────────────────────────────────────
// GET /api/recipes/search
// ──────────────────────────────────────────────────

describe('GET /api/recipes/search', () => {
  before(async () => {
    const user = await createUser();
    await createRecipe(user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id, {
      title: 'Ratatouille Provençale Unique',
      state: 'APPROVED',
    });
  });

  it('retourne les recettes correspondant au terme de recherche', async () => {
    const res = await request(app).get('/api/recipes/search?q=Ratatouille');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0, 'la recherche doit trouver au moins une recette');
  });

  it('retourne 400 si le paramètre q est absent', async () => {
    const res = await request(app).get('/api/recipes/search');
    assert.equal(res.status, 400);
  });
});

// ──────────────────────────────────────────────────
// GET /api/recipes/:id
// ──────────────────────────────────────────────────

describe('GET /api/recipes/:id', () => {
  let approvedRecipe: any;
  let pendingRecipe: any;

  before(async () => {
    const user = await createUser();
    approvedRecipe = await createRecipe(
      user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'APPROVED' },
    );
    pendingRecipe = await createRecipe(
      user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'PENDING' },
    );
  });

  it('retourne 200 avec le détail d\'une recette approuvée', async () => {
    const res = await request(app).get(`/api/recipes/${approvedRecipe.id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.id, approvedRecipe.id);
    assert.ok('isLiked' in res.body, 'le champ isLiked doit être présent');
  });

  it('retourne 404 pour une recette PENDING (non visible publiquement)', async () => {
    const res = await request(app).get(`/api/recipes/${pendingRecipe.id}`);
    assert.equal(res.status, 404);
  });

  it('retourne 404 pour un id inexistant', async () => {
    const res = await request(app).get('/api/recipes/999999');
    assert.equal(res.status, 404);
  });
});

// ──────────────────────────────────────────────────
// POST /api/recipes  (multipart/form-data)
// ──────────────────────────────────────────────────

describe('POST /api/recipes', () => {
  let user: any;

  before(async () => {
    user = await createUser({ email: uniqueEmail() });
  });

  // Construit les champs form-data pour créer une recette
  function buildRecipeForm(title: string) {
    return (req: request.Test) =>
      req
        .field('title', title)
        .field('description', 'Une délicieuse recette de test')
        .field('image', 'https://example.com/image.jpg')
        .field('prepTime', '15')
        .field('cookTime', '30')
        .field('servings', '4')
        .field('difficulty', 'EASY')
        .field('workId', String(testData.work!.id))
        .field('steps', JSON.stringify([{ order: 1, content: 'Étape 1' }]))
        .field(
          'recipeIngredients',
          JSON.stringify([{ ingredientId: testData.ingredient!.id, quantity: 1, unit: 'tasse' }]),
        )
        .field('thematics', JSON.stringify([testData.thematic!.id]));
  }

  it('crée une recette en état PENDING et retourne 201', async () => {
    const title = `Nouvelle recette ${Date.now()}`;
    const res = await buildRecipeForm(title)(
      request(app)
        .post('/api/recipes')
        .set('Authorization', bearerHeader(user)),
    );

    assert.equal(res.status, 201);
    assert.equal(res.body.title, title);
    assert.equal(res.body.state, 'PENDING', 'une recette créée par un user doit être PENDING');
  });

  it('retourne 401 sans authentification', async () => {
    const res = await buildRecipeForm(`Sans auth ${Date.now()}`)(
      request(app).post('/api/recipes'),
    );

    assert.equal(res.status, 401);
  });

  it('retourne 409 si une recette avec le même titre existe déjà', async () => {
    const title = `Titre dupliqué ${Date.now()}`;

    // Première création
    await buildRecipeForm(title)(
      request(app).post('/api/recipes').set('Authorization', bearerHeader(user)),
    );

    // Deuxième création avec le même titre
    const res = await buildRecipeForm(title)(
      request(app).post('/api/recipes').set('Authorization', bearerHeader(user)),
    );

    assert.equal(res.status, 409);
  });
});

// ──────────────────────────────────────────────────
// POST /api/recipes/:id/like  &  DELETE /api/recipes/:id/like
// ──────────────────────────────────────────────────

describe('Likes sur les recettes', () => {
  let user: any;
  let recipe: any;

  before(async () => {
    user = await createUser();
    recipe = await createRecipe(
      user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'APPROVED' },
    );
  });

  it('POST /api/recipes/:id/like — retourne 201 et like la recette', async () => {
    const res = await request(app)
      .post(`/api/recipes/${recipe.id}/like`)
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 201);
  });

  it('POST /api/recipes/:id/like — retourne 409 si déjà liké', async () => {
    // Le like du test précédent est toujours en base
    const res = await request(app)
      .post(`/api/recipes/${recipe.id}/like`)
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 409);
  });

  it('DELETE /api/recipes/:id/like — retourne 200 et retire le like', async () => {
    const res = await request(app)
      .delete(`/api/recipes/${recipe.id}/like`)
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 200);
  });

  it('DELETE /api/recipes/:id/like — retourne 404 si le like n\'existe pas', async () => {
    // Le like vient d'être supprimé dans le test précédent
    const res = await request(app)
      .delete(`/api/recipes/${recipe.id}/like`)
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 404);
  });

  it('POST /api/recipes/:id/like — retourne 401 sans authentification', async () => {
    const res = await request(app).post(`/api/recipes/${recipe.id}/like`);
    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// GET /api/recipes/:id/comments  &  POST /api/recipes/:id/comments
// DELETE /api/comments/:id
// ──────────────────────────────────────────────────

describe('Commentaires sur les recettes', () => {
  let author: any;
  let otherUser: any;
  let admin: any;
  let recipe: any;

  before(async () => {
    author = await createUser();
    otherUser = await createUser();
    admin = await createAdmin();
    recipe = await createRecipe(
      author.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'APPROVED' },
    );
  });

  it('GET /api/recipes/:id/comments — retourne 200 avec la liste des commentaires', async () => {
    const res = await request(app).get(`/api/recipes/${recipe.id}/comments`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  it('POST /api/recipes/:id/comments — crée un commentaire avec un score valide (1-5)', async () => {
    const res = await request(app)
      .post(`/api/recipes/${recipe.id}/comments`)
      .set('Authorization', bearerHeader(author))
      .send({ content: 'Délicieuse recette !', score: 5 });

    assert.equal(res.status, 201);
    assert.equal(res.body.score, 5);
    assert.equal(res.body.content, 'Délicieuse recette !');
  });

  it('POST /api/recipes/:id/comments — retourne 409 si l\'utilisateur a déjà commenté', async () => {
    // L'auteur a déjà posté un commentaire dans le test précédent
    const res = await request(app)
      .post(`/api/recipes/${recipe.id}/comments`)
      .set('Authorization', bearerHeader(author))
      .send({ content: 'Double commentaire', score: 3 });

    assert.equal(res.status, 409);
  });

  it('POST /api/recipes/:id/comments — retourne 400 si le score est hors de [1-5]', async () => {
    const res = await request(app)
      .post(`/api/recipes/${recipe.id}/comments`)
      .set('Authorization', bearerHeader(otherUser))
      .send({ content: 'Score invalide', score: 6 });

    assert.equal(res.status, 400);
  });

  it('POST /api/recipes/:id/comments — retourne 401 sans authentification', async () => {
    const res = await request(app)
      .post(`/api/recipes/${recipe.id}/comments`)
      .send({ content: 'Pas connecté', score: 4 });

    assert.equal(res.status, 401);
  });

  it('DELETE /api/comments/:id — l\'auteur peut supprimer son propre commentaire', async () => {
    // Créer un commentaire via otherUser
    const createRes = await request(app)
      .post(`/api/recipes/${recipe.id}/comments`)
      .set('Authorization', bearerHeader(otherUser))
      .send({ content: 'À supprimer', score: 2 });

    assert.equal(createRes.status, 201);
    const commentId = createRes.body.id;

    const deleteRes = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set('Authorization', bearerHeader(otherUser));

    assert.equal(deleteRes.status, 200);
  });

  it('DELETE /api/comments/:id — un admin peut supprimer n\'importe quel commentaire', async () => {
    // L'auteur recrée un commentaire (le sien a été supprimé lors d'un test précédent)
    // On utilise un third user pour créer un commentaire que l'admin va supprimer
    const thirdUser = await createUser();
    const thirdRecipe = await createRecipe(
      thirdUser.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'APPROVED' },
    );

    const createRes = await request(app)
      .post(`/api/recipes/${thirdRecipe.id}/comments`)
      .set('Authorization', bearerHeader(thirdUser))
      .send({ content: 'Commentaire à supprimer par admin', score: 3 });

    assert.equal(createRes.status, 201);

    const deleteRes = await request(app)
      .delete(`/api/comments/${createRes.body.id}`)
      .set('Authorization', bearerHeader(admin));

    assert.equal(deleteRes.status, 200);
  });

  it('DELETE /api/comments/:id — un user ne peut pas supprimer le commentaire d\'un autre', async () => {
    // Créer un commentaire par l'auteur (son premier commentaire a été supprimé)
    const newRecipe = await createRecipe(
      author.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'APPROVED' },
    );
    const createRes = await request(app)
      .post(`/api/recipes/${newRecipe.id}/comments`)
      .set('Authorization', bearerHeader(author))
      .send({ content: 'Mon commentaire', score: 4 });

    assert.equal(createRes.status, 201);

    // otherUser essaie de supprimer le commentaire d'author → 403
    const deleteRes = await request(app)
      .delete(`/api/comments/${createRes.body.id}`)
      .set('Authorization', bearerHeader(otherUser));

    assert.equal(deleteRes.status, 403);
  });
});
