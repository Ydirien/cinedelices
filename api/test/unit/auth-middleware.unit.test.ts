/**
 * Tests unitaires des middlewares d'authentification checkRoles et softAuth.
 * On simule les objets Express (req, res, next) sans démarrer de serveur.
 *
 * Note : DATABASE_URL est fixé à une URL fictive pour éviter que models/index.ts
 * (importé transitivement via auth.middleware → models/Role) ne lève une erreur.
 * Aucune connexion n'est établie car les tests ne font aucune requête Prisma.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response, NextFunction } from 'express';

// Ces vars d'env doivent être positionnées AVANT tout import qui charge config.ts / models/index.ts
process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-unit';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_unit';

const TEST_SECRET = 'test-access-secret-unit';

const jwt = await import('jsonwebtoken');
const { checkRoles, softAuth } = await import('../../src/middlewares/auth.middleware.ts');
const { UnauthorizedError, ForbiddenError } = await import('../../src/lib/errors.ts');

// Construit un objet Request minimaliste avec un header Authorization optionnel
function makeReq(authHeader?: string): Request {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
    user: undefined,
  } as unknown as Request;
}

// Construit un next() espion qui capture l'appel et l'erreur éventuelle
function makeNext(): { fn: NextFunction; wasCalled: boolean; error: unknown } {
  const spy = { fn: null as unknown as NextFunction, wasCalled: false, error: undefined as unknown };
  spy.fn = (err?: unknown) => {
    spy.wasCalled = true;
    spy.error = err;
  };
  return spy;
}

// Signe un token avec le secret de test
function signToken(payload: object, options?: { expired?: boolean }): string {
  if (options?.expired) {
    // Crée un token dont exp est dans le passé (déjà expiré)
    const expiredPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000) - 200,
      exp: Math.floor(Date.now() / 1000) - 100,
    };
    return jwt.default.sign(expiredPayload, TEST_SECRET);
  }
  return jwt.default.sign(payload, TEST_SECRET, { expiresIn: '15m' } as any);
}

// ──────────────────────────────────────────────────
// checkRoles
// ──────────────────────────────────────────────────

describe('checkRoles', () => {
  it('hydrate req.user et appelle next() quand le token est valide et le rôle autorisé', () => {
    const token = signToken({ id: 1, role: 'USER' });
    const req = makeReq(`Bearer ${token}`);
    const next = makeNext();

    checkRoles(['USER'])(req, {} as Response, next.fn);

    assert.equal(next.wasCalled, true, 'next() doit être appelé');
    assert.equal(next.error, undefined, 'next() ne doit pas recevoir d\'erreur');
    assert.deepEqual(req.user, { id: 1, role: 'USER' });
  });

  it('accepte ADMIN quand les deux rôles sont autorisés', () => {
    const token = signToken({ id: 2, role: 'ADMIN' });
    const req = makeReq(`Bearer ${token}`);
    const next = makeNext();

    checkRoles(['USER', 'ADMIN'])(req, {} as Response, next.fn);

    assert.equal(next.wasCalled, true);
    assert.deepEqual(req.user, { id: 2, role: 'ADMIN' });
  });

  it('lève UnauthorizedError quand aucun header Authorization n\'est présent', () => {
    const req = makeReq();
    const next = makeNext();

    assert.throws(
      () => checkRoles(['USER'])(req, {} as Response, next.fn),
      (err: unknown) => err instanceof UnauthorizedError,
    );
  });

  it('lève UnauthorizedError quand le token est expiré', () => {
    const token = signToken({ id: 1, role: 'USER' }, { expired: true });
    const req = makeReq(`Bearer ${token}`);
    const next = makeNext();

    assert.throws(
      () => checkRoles(['USER'])(req, {} as Response, next.fn),
      (err: unknown) => err instanceof UnauthorizedError,
    );
  });

  it('lève UnauthorizedError quand le token est malformé', () => {
    const req = makeReq('Bearer not.a.valid.jwt');
    const next = makeNext();

    assert.throws(
      () => checkRoles(['USER'])(req, {} as Response, next.fn),
      (err: unknown) => err instanceof UnauthorizedError,
    );
  });

  it('lève ForbiddenError quand le rôle de l\'utilisateur n\'est pas dans la liste autorisée', () => {
    const token = signToken({ id: 3, role: 'USER' });
    const req = makeReq(`Bearer ${token}`);
    const next = makeNext();

    assert.throws(
      () => checkRoles(['ADMIN'])(req, {} as Response, next.fn),
      (err: unknown) => err instanceof ForbiddenError,
    );
  });

  it('lève UnauthorizedError quand le header est présent mais sans token (Bearer vide)', () => {
    // 'Bearer '.split(' ')[1] === '' → falsy → UnauthorizedError
    const req = makeReq('Bearer ');
    const next = makeNext();

    assert.throws(
      () => checkRoles(['USER'])(req, {} as Response, next.fn),
      (err: unknown) => err instanceof UnauthorizedError,
    );
  });
});

// ──────────────────────────────────────────────────
// softAuth
// ──────────────────────────────────────────────────

describe('softAuth', () => {
  it('hydrate req.user quand le token est valide', () => {
    const token = signToken({ id: 5, role: 'ADMIN' });
    const req = makeReq(`Bearer ${token}`);
    const next = makeNext();

    softAuth(req, {} as Response, next.fn);

    assert.equal(next.wasCalled, true);
    assert.deepEqual(req.user, { id: 5, role: 'ADMIN' });
  });

  it('appelle next() sans toucher req.user quand aucun header n\'est présent', () => {
    const req = makeReq();
    const next = makeNext();

    softAuth(req, {} as Response, next.fn);

    assert.equal(next.wasCalled, true);
    assert.equal(req.user, undefined);
    assert.equal(next.error, undefined);
  });

  it('appelle next() sans erreur quand le token est invalide (ne bloque pas la requête)', () => {
    const req = makeReq('Bearer token-completement-invalide');
    const next = makeNext();

    softAuth(req, {} as Response, next.fn);

    assert.equal(next.wasCalled, true);
    assert.equal(req.user, undefined, 'req.user ne doit pas être défini si le token est invalide');
    assert.equal(next.error, undefined, 'softAuth ne doit jamais propager d\'erreur');
  });

  it('appelle next() sans erreur quand le token est expiré', () => {
    const token = signToken({ id: 1, role: 'USER' }, { expired: true });
    const req = makeReq(`Bearer ${token}`);
    const next = makeNext();

    softAuth(req, {} as Response, next.fn);

    assert.equal(next.wasCalled, true);
    assert.equal(req.user, undefined);
    assert.equal(next.error, undefined);
  });
});
