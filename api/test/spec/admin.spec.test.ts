/**
 * Tests d'intégration des routes d'administration.
 * Vérifie que les routes sont bien protégées (ADMIN uniquement)
 * et que les opérations de gestion (recettes, utilisateurs) fonctionnent.
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
// GET /api/admin/dashboard
// ──────────────────────────────────────────────────

describe('GET /api/admin/dashboard', () => {
  let admin: any;
  let user: any;

  before(async () => {
    admin = await createAdmin();
    user = await createUser();
  });

  it('retourne 200 avec les statistiques pour un ADMIN', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 200);
    assert.ok(res.body.stats, 'le champ stats doit être présent');
    assert.ok(typeof res.body.stats.totalRecipes === 'number');
    assert.ok(typeof res.body.stats.totalUsers === 'number');
    assert.ok(Array.isArray(res.body.latestPendingRecipes));
  });

  it('retourne 403 pour un utilisateur avec le rôle USER', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 403);
  });

  it('retourne 401 sans authentification', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// POST /api/admin/recipes  (création directe en JSON, état APPROVED par défaut)
// ──────────────────────────────────────────────────

describe('POST /api/admin/recipes', () => {
  let admin: any;

  before(async () => {
    admin = await createAdmin();
  });

  it('crée une recette en JSON et retourne 201 (état APPROVED par défaut)', async () => {
    const res = await request(app)
      .post('/api/admin/recipes')
      .set('Authorization', bearerHeader(admin))
      .send({
        title: `Recette admin ${Date.now()}`,
        description: 'Créée directement par un admin',
        image: 'https://example.com/admin-recipe.jpg',
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        difficulty: 'EASY',
        workId: testData.work!.id,
        steps: [{ order: 1, content: 'Étape admin' }],
        recipeIngredients: [{ ingredientId: testData.ingredient!.id, quantity: 2, unit: 'g' }],
        thematics: [testData.thematic!.id],
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.state, 'APPROVED', 'une recette créée par un admin est APPROVED par défaut');
  });

  it('retourne 409 si le titre existe déjà', async () => {
    const title = `Titre unique admin ${Date.now()}`;

    // Premier appel (succès)
    await request(app)
      .post('/api/admin/recipes')
      .set('Authorization', bearerHeader(admin))
      .send({
        title,
        description: 'Description',
        image: 'https://example.com/img.jpg',
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        difficulty: 'EASY',
        workId: testData.work!.id,
        steps: [{ order: 1, content: 'Étape' }],
        recipeIngredients: [{ ingredientId: testData.ingredient!.id, quantity: 1, unit: 'g' }],
        thematics: [testData.thematic!.id],
      });

    // Deuxième appel avec le même titre
    const res = await request(app)
      .post('/api/admin/recipes')
      .set('Authorization', bearerHeader(admin))
      .send({
        title,
        description: 'Description dupliquée',
        image: 'https://example.com/img2.jpg',
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        difficulty: 'EASY',
        workId: testData.work!.id,
        steps: [{ order: 1, content: 'Étape' }],
        recipeIngredients: [{ ingredientId: testData.ingredient!.id, quantity: 1, unit: 'g' }],
        thematics: [testData.thematic!.id],
      });

    assert.equal(res.status, 409);
  });

  it('retourne 403 pour un USER', async () => {
    const user = await createUser();
    const res = await request(app)
      .post('/api/admin/recipes')
      .set('Authorization', bearerHeader(user))
      .send({
        title: `Tentative user ${Date.now()}`,
        description: 'Non autorisé',
        image: 'https://example.com/img.jpg',
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        difficulty: 'EASY',
        workId: testData.work!.id,
        steps: [{ order: 1, content: 'Étape' }],
        recipeIngredients: [{ ingredientId: testData.ingredient!.id, quantity: 1, unit: 'g' }],
        thematics: [testData.thematic!.id],
      });

    assert.equal(res.status, 403);
  });
});

// ──────────────────────────────────────────────────
// GET /api/admin/recipes/:id
// ──────────────────────────────────────────────────

describe('GET /api/admin/recipes/:id', () => {
  let admin: any;
  let recipe: any;

  before(async () => {
    admin = await createAdmin();
    const owner = await createUser();
    recipe = await createRecipe(
      owner.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'PENDING' },
    );
  });

  it('retourne 200 avec le détail complet de la recette (tout état)', async () => {
    const res = await request(app)
      .get(`/api/admin/recipes/${recipe.id}`)
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 200);
    assert.equal(res.body.id, recipe.id);
    // L'admin voit aussi les recettes PENDING
    assert.equal(res.body.state, 'PENDING');
  });

  it('retourne 404 pour un id inexistant', async () => {
    const res = await request(app)
      .get('/api/admin/recipes/999999')
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 404);
  });
});

// ──────────────────────────────────────────────────
// GET /api/admin/recipes
// ──────────────────────────────────────────────────

describe('GET /api/admin/recipes', () => {
  let admin: any;

  before(async () => {
    admin = await createAdmin();
    const owner = await createUser();
    // Crée des recettes dans différents états pour vérifier que tout est visible
    await createRecipe(
      owner.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'PENDING' },
    );
    await createRecipe(
      owner.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'APPROVED' },
    );
    await createRecipe(
      owner.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'REJECTED' },
    );
  });

  it('retourne toutes les recettes quel que soit leur état (PENDING, APPROVED, REJECTED)', async () => {
    const res = await request(app)
      .get('/api/admin/recipes')
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));

    const states = res.body.data.map((r: any) => r.state);
    assert.ok(states.includes('PENDING'), 'les recettes PENDING doivent être visibles');
    assert.ok(states.includes('APPROVED'), 'les recettes APPROVED doivent être visibles');
    assert.ok(states.includes('REJECTED'), 'les recettes REJECTED doivent être visibles');
  });

  it('filtre par état quand le paramètre state est fourni', async () => {
    const res = await request(app)
      .get('/api/admin/recipes?state=PENDING')
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 200);
    for (const recipe of res.body.data) {
      assert.equal(recipe.state, 'PENDING');
    }
  });
});

// ──────────────────────────────────────────────────
// PATCH /api/admin/recipes/:id/state
// ──────────────────────────────────────────────────

describe('PATCH /api/admin/recipes/:id/state', () => {
  let admin: any;
  let user: any;
  let pendingRecipe: any;

  before(async () => {
    admin = await createAdmin();
    user = await createUser();
    pendingRecipe = await createRecipe(
      user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'PENDING' },
    );
  });

  it('approuve une recette PENDING et retourne la recette mise à jour', async () => {
    const res = await request(app)
      .patch(`/api/admin/recipes/${pendingRecipe.id}/state`)
      .set('Authorization', bearerHeader(admin))
      .send({ state: 'APPROVED' });

    assert.equal(res.status, 200);
    assert.equal(res.body.state, 'APPROVED');
    assert.equal(res.body.id, pendingRecipe.id);
  });

  it('rejette une recette et retourne 200', async () => {
    const owner = await createUser();
    const recipe = await createRecipe(
      owner.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'PENDING' },
    );

    const res = await request(app)
      .patch(`/api/admin/recipes/${recipe.id}/state`)
      .set('Authorization', bearerHeader(admin))
      .send({ state: 'REJECTED' });

    assert.equal(res.status, 200);
    assert.equal(res.body.state, 'REJECTED');
  });

  it('retourne 403 quand un USER essaie de changer l\'état d\'une recette', async () => {
    const res = await request(app)
      .patch(`/api/admin/recipes/${pendingRecipe.id}/state`)
      .set('Authorization', bearerHeader(user))
      .send({ state: 'APPROVED' });

    assert.equal(res.status, 403);
  });

  it('retourne 404 pour une recette inexistante', async () => {
    const res = await request(app)
      .patch('/api/admin/recipes/999999/state')
      .set('Authorization', bearerHeader(admin))
      .send({ state: 'APPROVED' });

    assert.equal(res.status, 404);
  });

  it('retourne 400 quand le state fourni est invalide', async () => {
    const res = await request(app)
      .patch(`/api/admin/recipes/${pendingRecipe.id}/state`)
      .set('Authorization', bearerHeader(admin))
      .send({ state: 'INVALIDE' });

    assert.equal(res.status, 400);
  });
});

// ──────────────────────────────────────────────────
// DELETE /api/admin/recipes/:id
// ──────────────────────────────────────────────────

describe('DELETE /api/admin/recipes/:id', () => {
  let admin: any;

  before(async () => {
    admin = await createAdmin();
  });

  it('supprime une recette et retourne 204', async () => {
    const owner = await createUser();
    const recipe = await createRecipe(
      owner.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
    );

    const res = await request(app)
      .delete(`/api/admin/recipes/${recipe.id}`)
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 204);

    const deleted = await prisma.recipe.findUnique({ where: { id: recipe.id } });
    assert.equal(deleted, null, 'la recette doit être supprimée de la base');
  });

  it('retourne 404 pour une recette inexistante', async () => {
    const res = await request(app)
      .delete('/api/admin/recipes/999999')
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 404);
  });
});

// ──────────────────────────────────────────────────
// GET /api/admin/users
// ──────────────────────────────────────────────────

describe('GET /api/admin/users', () => {
  let admin: any;

  before(async () => {
    admin = await createAdmin();
    await createUser();
    await createUser();
  });

  it('retourne la liste paginée des utilisateurs', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(typeof res.body.total === 'number');

    // Aucun utilisateur ne doit exposer son mot de passe
    for (const u of res.body.data) {
      assert.equal(u.password, undefined, 'le mot de passe ne doit jamais être exposé');
    }
  });

  it('filtre par rôle quand le paramètre role est fourni', async () => {
    const res = await request(app)
      .get('/api/admin/users?role=ADMIN')
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 200);
    for (const u of res.body.data) {
      assert.equal(u.role, 'ADMIN');
    }
  });
});

// ──────────────────────────────────────────────────
// PATCH /api/admin/users/:id/role
// ──────────────────────────────────────────────────

describe('PATCH /api/admin/users/:id/role', () => {
  let admin: any;
  let targetUser: any;

  before(async () => {
    admin = await createAdmin({ email: uniqueEmail() });
    targetUser = await createUser({ email: uniqueEmail() });
  });

  it('change le rôle d\'un utilisateur vers ADMIN', async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${targetUser.id}/role`)
      .set('Authorization', bearerHeader(admin))
      .send({ role: 'ADMIN' });

    assert.equal(res.status, 200);
    assert.equal(res.body.role, 'ADMIN');
  });

  it('retourne 409 quand l\'admin essaie de modifier son propre rôle', async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${admin.id}/role`)
      .set('Authorization', bearerHeader(admin))
      .send({ role: 'USER' });

    assert.equal(res.status, 409);
  });

  it('retourne 404 pour un utilisateur inexistant', async () => {
    const res = await request(app)
      .patch('/api/admin/users/999999/role')
      .set('Authorization', bearerHeader(admin))
      .send({ role: 'USER' });

    assert.equal(res.status, 404);
  });

  it('retourne 400 pour un rôle invalide', async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${targetUser.id}/role`)
      .set('Authorization', bearerHeader(admin))
      .send({ role: 'SUPERADMIN' });

    assert.equal(res.status, 400);
  });
});

// ──────────────────────────────────────────────────
// DELETE /api/admin/users/:id
// ──────────────────────────────────────────────────

describe('DELETE /api/admin/users/:id', () => {
  let admin: any;

  before(async () => {
    admin = await createAdmin({ email: uniqueEmail() });
  });

  it('supprime un utilisateur et retourne 204', async () => {
    const target = await createUser({ email: uniqueEmail() });

    const res = await request(app)
      .delete(`/api/admin/users/${target.id}`)
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 204);

    const deleted = await prisma.user.findUnique({ where: { id: target.id } });
    assert.equal(deleted, null, 'l\'utilisateur doit être supprimé de la base');
  });

  it('retourne 409 quand l\'admin essaie de supprimer son propre compte', async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${admin.id}`)
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 409);
  });

  it('retourne 404 pour un utilisateur inexistant', async () => {
    const res = await request(app)
      .delete('/api/admin/users/999999')
      .set('Authorization', bearerHeader(admin));

    assert.equal(res.status, 404);
  });

  it('supprime aussi les recettes de l\'utilisateur (cascade)', async () => {
    const target = await createUser({ email: uniqueEmail() });
    const recipe = await createRecipe(
      target.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
    );

    await request(app)
      .delete(`/api/admin/users/${target.id}`)
      .set('Authorization', bearerHeader(admin));

    const deletedRecipe = await prisma.recipe.findUnique({ where: { id: recipe.id } });
    assert.equal(deletedRecipe, null, 'les recettes de l\'utilisateur supprimé doivent disparaître');
  });
});
