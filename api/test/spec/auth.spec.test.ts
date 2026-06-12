/**
 * Tests d'intégration des routes d'authentification.
 * Couvre register, login, logout, refresh token et réinitialisation de mot de passe.
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import argon2 from 'argon2';
import { app } from '../../src/app.ts';
import { prisma } from '../../src/models/index.ts';
import { generateResetPasswordToken } from '../../src/lib/tokens.ts';
import { createUser, TEST_PASSWORD, uniqueEmail, uniqueUsername } from '../helpers/test-helpers.ts';

// ──────────────────────────────────────────────────
// POST /api/register
// ──────────────────────────────────────────────────

describe('POST /api/register', () => {
  it('crée un utilisateur et retourne 201 sans le champ password', async () => {
    const res = await request(app).post('/api/register').send({
      username: uniqueUsername(),
      email: uniqueEmail(),
      password: 'StrongPass123',
      confirm: 'StrongPass123',
    });

    assert.equal(res.status, 201);
    assert.ok(res.body.id, 'l\'id doit être retourné');
    assert.ok(res.body.email, 'l\'email doit être retourné');
    assert.equal(res.body.password, undefined, 'le hash du mot de passe ne doit jamais être exposé');
  });

  it('retourne 409 quand l\'email est déjà utilisé', async () => {
    const email = uniqueEmail();

    // Premier enregistrement (succès attendu)
    await request(app).post('/api/register').send({
      username: uniqueUsername(),
      email,
      password: 'StrongPass123',
      confirm: 'StrongPass123',
    });

    // Deuxième avec le même email (conflit attendu)
    const res = await request(app).post('/api/register').send({
      username: uniqueUsername(),
      email,
      password: 'StrongPass123',
      confirm: 'StrongPass123',
    });

    assert.equal(res.status, 409);
  });

  it('retourne 400 quand le mot de passe est trop court (< 12 caractères)', async () => {
    const res = await request(app).post('/api/register').send({
      username: uniqueUsername(),
      email: uniqueEmail(),
      password: 'Short1',
      confirm: 'Short1',
    });

    assert.equal(res.status, 400);
  });

  it('retourne 400 quand le mot de passe ne contient pas de majuscule', async () => {
    const res = await request(app).post('/api/register').send({
      username: uniqueUsername(),
      email: uniqueEmail(),
      password: 'alllowercase123',
      confirm: 'alllowercase123',
    });

    assert.equal(res.status, 400);
  });

  it('retourne 400 quand les mots de passe ne correspondent pas', async () => {
    const res = await request(app).post('/api/register').send({
      username: uniqueUsername(),
      email: uniqueEmail(),
      password: 'StrongPass123',
      confirm: 'DifferentPass456',
    });

    assert.equal(res.status, 400);
  });

  it('retourne 400 quand le body est vide', async () => {
    const res = await request(app).post('/api/register').send({});
    assert.equal(res.status, 400);
  });
});

// ──────────────────────────────────────────────────
// POST /api/login
// ──────────────────────────────────────────────────

describe('POST /api/login', () => {
  let userEmail: string;

  before(async () => {
    userEmail = uniqueEmail();
    await createUser({ email: userEmail });
  });

  it('retourne 200 avec accessToken et refreshToken sur des identifiants valides', async () => {
    const res = await request(app).post('/api/login').send({
      email: userEmail,
      password: TEST_PASSWORD,
    });

    assert.equal(res.status, 200);
    assert.ok(res.body.accessToken?.token, 'accessToken doit être présent');
    assert.ok(res.body.refreshToken?.token, 'refreshToken doit être présent');
  });

  it('retourne 401 quand l\'email n\'existe pas', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'nobody@example.com',
      password: TEST_PASSWORD,
    });

    assert.equal(res.status, 401);
  });

  it('retourne 401 quand le mot de passe est incorrect', async () => {
    const res = await request(app).post('/api/login').send({
      email: userEmail,
      password: 'WrongPassword999',
    });

    assert.equal(res.status, 401);
  });

  it('retourne 400 quand l\'email est malformé', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'pas-un-email',
      password: TEST_PASSWORD,
    });

    assert.equal(res.status, 400);
  });
});

// ──────────────────────────────────────────────────
// POST /api/logout
// ──────────────────────────────────────────────────

describe('POST /api/logout', () => {
  it('retourne 204 et supprime le refresh token en base', async () => {
    const email = uniqueEmail();
    const user = await createUser({ email });

    const loginRes = await request(app).post('/api/login').send({
      email,
      password: TEST_PASSWORD,
    });
    const accessToken = loginRes.body.accessToken.token;

    const res = await request(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    assert.equal(res.status, 204);

    // Le refresh token doit avoir été supprimé de la base
    const count = await prisma.refreshToken.count({ where: { userId: user.id } });
    assert.equal(count, 0, 'le refresh token doit être supprimé après logout');
  });

  it('retourne 401 quand aucun token n\'est fourni', async () => {
    const res = await request(app).post('/api/logout');
    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// POST /api/refresh
// ──────────────────────────────────────────────────

describe('POST /api/refresh', () => {
  it('retourne 200 avec de nouveaux tokens quand le refresh token est valide', async () => {
    const email = uniqueEmail();
    await createUser({ email });

    const loginRes = await request(app).post('/api/login').send({
      email,
      password: TEST_PASSWORD,
    });
    const oldRefreshToken = loginRes.body.refreshToken.token;

    const res = await request(app)
      .post('/api/refresh')
      .send({ refreshToken: oldRefreshToken });

    assert.equal(res.status, 200);
    assert.ok(res.body.accessToken?.token, 'un nouvel accessToken doit être retourné');
    assert.ok(res.body.refreshToken?.token, 'un nouveau refreshToken doit être retourné');
  });

  it('retourne 401 quand le refresh token est absent du body', async () => {
    const res = await request(app).post('/api/refresh').send({});
    assert.equal(res.status, 401);
  });

  it('retourne 401 quand le refresh token est inconnu (non présent en base)', async () => {
    const res = await request(app)
      .post('/api/refresh')
      .send({ refreshToken: 'token-inconnu-qui-nexiste-pas-en-base' });

    assert.equal(res.status, 401);
  });
});

// ──────────────────────────────────────────────────
// POST /api/forgot-password
// ──────────────────────────────────────────────────

describe('POST /api/forgot-password', () => {
  it('retourne 200 même si l\'email n\'existe pas (protection contre l\'énumération)', async () => {
    const res = await request(app).post('/api/forgot-password').send({
      email: 'inconnu@example.com',
    });

    assert.equal(res.status, 200);
  });

  it('retourne 200 et stocke un token de reset hashé quand l\'email existe', async () => {
    const email = uniqueEmail();
    const user = await createUser({ email });

    const res = await request(app).post('/api/forgot-password').send({ email });

    assert.equal(res.status, 200);

    // Un token hashé doit être persisté en base
    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    assert.ok(updated?.resetToken, 'le resetToken hashé doit être stocké en base');
  });

  it('retourne 400 quand l\'email est malformé', async () => {
    const res = await request(app).post('/api/forgot-password').send({
      email: 'pas-un-email',
    });

    assert.equal(res.status, 400);
  });
});

// ──────────────────────────────────────────────────
// POST /api/reset-password
// ──────────────────────────────────────────────────

describe('POST /api/reset-password', () => {
  it('réinitialise le mot de passe avec un token valide', async () => {
    const email = uniqueEmail();
    const user = await createUser({ email });

    // On génère le token manuellement pour éviter la dépendance au mailer
    const resetToken = generateResetPasswordToken(user as any);
    const hashedToken = await argon2.hash(resetToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken },
    });

    const res = await request(app).post('/api/reset-password').send({
      email,
      resetToken,
      newPassword: 'NewStrongPass456',
    });

    assert.equal(res.status, 200);

    // On vérifie qu'on peut maintenant se connecter avec le nouveau mot de passe
    const loginRes = await request(app).post('/api/login').send({
      email,
      password: 'NewStrongPass456',
    });
    assert.equal(loginRes.status, 200, 'le login avec le nouveau mot de passe doit réussir');
  });

  it('supprime le resetToken après utilisation (usage unique)', async () => {
    const email = uniqueEmail();
    const user = await createUser({ email });

    const resetToken = generateResetPasswordToken(user as any);
    const hashedToken = await argon2.hash(resetToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken },
    });

    // Premier appel réussit
    await request(app).post('/api/reset-password').send({
      email,
      resetToken,
      newPassword: 'NewStrongPass456',
    });

    // Deuxième appel avec le même token doit échouer (token supprimé)
    const second = await request(app).post('/api/reset-password').send({
      email,
      resetToken,
      newPassword: 'AnotherPass789',
    });

    assert.equal(second.status, 401, 'un token déjà utilisé doit être rejeté');
  });

  it('retourne 401 quand le token est invalide', async () => {
    const email = uniqueEmail();
    const user = await createUser({ email });

    const res = await request(app).post('/api/reset-password').send({
      email,
      resetToken: 'ce-nest-pas-un-jwt-valide',
      newPassword: 'NewStrongPass456',
    });

    assert.equal(res.status, 401);
  });

  it('retourne 400 quand le nouveau mot de passe est trop faible', async () => {
    const email = uniqueEmail();
    await createUser({ email });

    const res = await request(app).post('/api/reset-password').send({
      email,
      resetToken: 'peu-importe',
      newPassword: 'weak',
    });

    assert.equal(res.status, 400);
  });
});
