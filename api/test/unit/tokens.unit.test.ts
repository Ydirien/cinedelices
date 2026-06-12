/**
 * Tests unitaires de la génération de tokens JWT et refresh.
 * Les secrets sont positionnés avant tout import pour ne pas dépendre du .env local.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Secrets de test positionnés avant l'import de config.ts
process.env.ACCESS_TOKEN_SECRET = 'test-access-secret';
process.env.RESET_TOKEN_SECRET = 'test-reset-secret';

// Import dynamique pour s'assurer que process.env est déjà défini
const { generateAuthTokens, generateResetPasswordToken } = await import('../../src/lib/tokens.ts');
const jwt = await import('jsonwebtoken');

// Utilisateur fictif minimal pour les tests
const fakeUser = { id: 42, role: 'USER' } as any;

describe('generateAuthTokens', () => {
  it('retourne un accessToken et un refreshToken', () => {
    const { accessToken, refreshToken } = generateAuthTokens(fakeUser);
    assert.ok(accessToken, 'accessToken doit exister');
    assert.ok(refreshToken, 'refreshToken doit exister');
    assert.ok(accessToken.token, 'accessToken.token doit être une chaîne non vide');
    assert.ok(refreshToken.token, 'refreshToken.token doit être une chaîne non vide');
  });

  it('accessToken est un JWT valide contenant id et role', () => {
    const { accessToken } = generateAuthTokens(fakeUser);
    const decoded = jwt.default.verify(accessToken.token, 'test-access-secret') as any;
    assert.equal(decoded.id, 42);
    assert.equal(decoded.role, 'USER');
  });

  it("accessToken expire dans 15 minutes (900 000 ms)", () => {
    const { accessToken } = generateAuthTokens(fakeUser);
    assert.equal(accessToken.expiresInMS, 15 * 60 * 1000);
    assert.equal(accessToken.type, 'Bearer');
  });

  it('refreshToken est une chaîne hexadécimale de 128 caractères', () => {
    const { refreshToken } = generateAuthTokens(fakeUser);
    // 64 bytes encodés en hex = 128 caractères
    assert.match(refreshToken.token, /^[a-f0-9]{128}$/);
  });

  it('refreshToken expire dans 7 jours', () => {
    const { refreshToken } = generateAuthTokens(fakeUser);
    assert.equal(refreshToken.expiresInMS, 7 * 24 * 60 * 60 * 1000);
  });

  it('deux appels successifs produisent des refreshTokens différents', () => {
    const first = generateAuthTokens(fakeUser).refreshToken.token;
    const second = generateAuthTokens(fakeUser).refreshToken.token;
    assert.notEqual(first, second);
  });
});

describe('generateResetPasswordToken', () => {
  it('retourne un JWT signé avec le secret de reset', () => {
    const token = generateResetPasswordToken(fakeUser);
    const decoded = jwt.default.verify(token, 'test-reset-secret') as any;
    assert.equal(decoded.id, 42);
  });

  it('expire dans 15 minutes (900 secondes)', () => {
    const token = generateResetPasswordToken(fakeUser);
    const decoded = jwt.default.decode(token) as any;
    const durationSec = decoded.exp - decoded.iat;
    assert.equal(durationSec, 15 * 60);
  });

  it('est invalide si vérifié avec le mauvais secret', () => {
    const token = generateResetPasswordToken(fakeUser);
    assert.throws(() => jwt.default.verify(token, 'wrong-secret'));
  });
});
