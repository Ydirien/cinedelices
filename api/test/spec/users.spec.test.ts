/**
 * Tests d'intégration des routes de profil utilisateur.
 * Couvre la consultation, la modification, le changement de mot de passe,
 * la suppression de compte ainsi que les listes de recettes et de favoris.
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../../src/app.ts';
import { prisma } from '../../src/models/index.ts';
import { testData } from '../config/global-setup.ts';
import {
  createUser,
  createRecipe,
  bearerHeader,
  TEST_PASSWORD,
  uniqueEmail,
} from '../helpers/test-helpers.ts';

// ──────────────────────────────────────────────────
// GET /api/profile
// ──────────────────────────────────────────────────

describe('GET /api/profile', () => {
  let user: any;

  before(async () => {
    user = await createUser({ email: uniqueEmail() });
  });

  it('retourne 200 avec les données du profil (sans le mot de passe)', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 200);
    assert.equal(res.body.id, user.id);
    assert.equal(res.body.email, user.email);
    assert.equal(res.body.password, undefined, 'le hash ne doit jamais être exposé');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/profile');
    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// PUT /api/profile
// ──────────────────────────────────────────────────

describe('PUT /api/profile', () => {
  it('met à jour le username et retourne les nouvelles données', async () => {
    const user = await createUser();
    const newUsername = `updated_${Date.now()}`;

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', bearerHeader(user))
      .send({ username: newUsername });

    assert.equal(res.status, 200);
    assert.equal(res.body.username, newUsername);
  });

  it('retourne 409 si le nouvel email est déjà utilisé par un autre compte', async () => {
    const userA = await createUser();
    const userB = await createUser();

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', bearerHeader(userA))
      .send({ email: userB.email }); // email de userB déjà pris

    assert.equal(res.status, 409);
  });

  it('retourne 400 si le body est vide (aucun champ fourni)', async () => {
    const user = await createUser();

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', bearerHeader(user))
      .send({});

    assert.equal(res.status, 400);
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app)
      .put('/api/profile')
      .send({ username: 'test' });

    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// PATCH /api/profile/password
// ──────────────────────────────────────────────────

describe('PATCH /api/profile/password', () => {
  it('change le mot de passe avec le mot de passe actuel correct', async () => {
    const user = await createUser();

    const res = await request(app)
      .patch('/api/profile/password')
      .set('Authorization', bearerHeader(user))
      .send({
        currentPassword: TEST_PASSWORD,
        newPassword: 'NewPassword456',
        confirm: 'NewPassword456',
      });

    assert.equal(res.status, 200);
  });

  it('retourne 401 quand le mot de passe actuel est incorrect', async () => {
    const user = await createUser();

    const res = await request(app)
      .patch('/api/profile/password')
      .set('Authorization', bearerHeader(user))
      .send({
        currentPassword: 'MauvaisMotDePasse99',
        newPassword: 'NewPassword456',
        confirm: 'NewPassword456',
      });

    assert.equal(res.status, 401);
  });

  it('retourne 400 quand le nouveau mot de passe est trop faible', async () => {
    const user = await createUser();

    const res = await request(app)
      .patch('/api/profile/password')
      .set('Authorization', bearerHeader(user))
      .send({
        currentPassword: TEST_PASSWORD,
        newPassword: 'faible',
        confirm: 'faible',
      });

    assert.equal(res.status, 400);
  });

  it('retourne 400 quand les nouveaux mots de passe ne correspondent pas', async () => {
    const user = await createUser();

    const res = await request(app)
      .patch('/api/profile/password')
      .set('Authorization', bearerHeader(user))
      .send({
        currentPassword: TEST_PASSWORD,
        newPassword: 'NewPassword456',
        confirm: 'PasswordDifferent789',
      });

    assert.equal(res.status, 400);
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app)
      .patch('/api/profile/password')
      .send({
        currentPassword: TEST_PASSWORD,
        newPassword: 'NewPassword456',
        confirm: 'NewPassword456',
      });

    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// DELETE /api/profile
// ──────────────────────────────────────────────────

describe('DELETE /api/profile', () => {
  it('supprime le compte et retourne 204', async () => {
    const user = await createUser();

    const res = await request(app)
      .delete('/api/profile')
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 204);

    // Le compte ne doit plus exister en base
    const deleted = await prisma.user.findUnique({ where: { id: user.id } });
    assert.equal(deleted, null, 'l\'utilisateur doit être supprimé de la base');
  });

  it('supprime également les recettes de l\'utilisateur (cascade)', async () => {
    const user = await createUser();
    const recipe = await createRecipe(
      user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
    );

    await request(app)
      .delete('/api/profile')
      .set('Authorization', bearerHeader(user));

    const deletedRecipe = await prisma.recipe.findUnique({ where: { id: recipe.id } });
    assert.equal(deletedRecipe, null, 'les recettes de l\'utilisateur doivent être supprimées');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).delete('/api/profile');
    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// GET /api/profile/recipes
// ──────────────────────────────────────────────────

describe('GET /api/profile/recipes', () => {
  let user: any;

  before(async () => {
    user = await createUser();
    // Crée une recette PENDING et une APPROVED pour cet utilisateur
    await createRecipe(
      user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'PENDING' },
    );
    await createRecipe(
      user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'APPROVED' },
    );
  });

  it('retourne 200 avec toutes les recettes de l\'utilisateur (tous états confondus)', async () => {
    const res = await request(app)
      .get('/api/profile/recipes')
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data), 'data doit être un tableau');
    assert.ok(res.body.data.length >= 2, 'doit retourner au moins 2 recettes');
  });

  it('filtre par état PENDING quand le paramètre state=PENDING est passé', async () => {
    const res = await request(app)
      .get('/api/profile/recipes?state=PENDING')
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 200);
    for (const recipe of res.body.data) {
      assert.equal(recipe.state, 'PENDING');
    }
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/profile/recipes');
    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// GET /api/profile/likes
// ──────────────────────────────────────────────────

describe('GET /api/profile/likes', () => {
  let user: any;

  before(async () => {
    user = await createUser();
    const recipe = await createRecipe(
      user.id, testData.work!.id, testData.ingredient!.id, testData.thematic!.id,
      { state: 'APPROVED' },
    );

    // Like direct en base pour ne pas dépendre de la route like
    await prisma.like.create({ data: { userId: user.id, recipeId: recipe.id } });
  });

  it('retourne 200 avec les recettes likées', async () => {
    const res = await request(app)
      .get('/api/profile/likes')
      .set('Authorization', bearerHeader(user));

    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 1, 'doit retourner au moins la recette likée');
  });

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/profile/likes');
    assert.equal(res.status, 401);
  });
});
