/**
 * Tests unitaires des classes d'erreur HTTP personnalisées.
 * Vérifie que chaque classe expose le bon status code et le bon message.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  HttpClientError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../src/lib/errors.ts';

describe('HttpClientError', () => {
  it('stocke le message et le status passés au constructeur', () => {
    const err = new HttpClientError('quelque chose a raté', { status: 418 });
    assert.equal(err.message, 'quelque chose a raté');
    assert.equal(err.status, 418);
  });

  it('est une instance de Error (hérite correctement)', () => {
    const err = new HttpClientError('msg', { status: 400 });
    assert.ok(err instanceof Error);
  });

  it('expose le nom de la classe concrète via err.name', () => {
    const err = new HttpClientError('msg', { status: 400 });
    assert.equal(err.name, 'HttpClientError');
  });
});

describe('BadRequestError', () => {
  it('a le status 400', () => {
    const err = new BadRequestError('champ manquant');
    assert.equal(err.status, 400);
    assert.equal(err.message, 'champ manquant');
  });

  it('est une instance de HttpClientError', () => {
    assert.ok(new BadRequestError('') instanceof HttpClientError);
  });
});

describe('UnauthorizedError', () => {
  it('a le status 401', () => {
    const err = new UnauthorizedError('token invalide');
    assert.equal(err.status, 401);
  });

  it('est une instance de HttpClientError', () => {
    assert.ok(new UnauthorizedError('') instanceof HttpClientError);
  });
});

describe('ForbiddenError', () => {
  it('a le status 403', () => {
    const err = new ForbiddenError('accès interdit');
    assert.equal(err.status, 403);
  });

  it('est une instance de HttpClientError', () => {
    assert.ok(new ForbiddenError('') instanceof HttpClientError);
  });
});

describe('NotFoundError', () => {
  it('a le status 404', () => {
    const err = new NotFoundError('ressource introuvable');
    assert.equal(err.status, 404);
  });

  it('est une instance de HttpClientError', () => {
    assert.ok(new NotFoundError('') instanceof HttpClientError);
  });
});

describe('ConflictError', () => {
  it('a le status 409', () => {
    const err = new ConflictError('email déjà utilisé');
    assert.equal(err.status, 409);
  });

  it('est une instance de HttpClientError', () => {
    assert.ok(new ConflictError('') instanceof HttpClientError);
  });
});

describe('Hiérarchie de classes', () => {
  it('toutes les erreurs héritent de Error et de HttpClientError', () => {
    const errors = [
      new BadRequestError(''),
      new UnauthorizedError(''),
      new ForbiddenError(''),
      new NotFoundError(''),
      new ConflictError(''),
    ];

    for (const err of errors) {
      assert.ok(err instanceof Error, `${err.constructor.name} doit être un Error`);
      assert.ok(err instanceof HttpClientError, `${err.constructor.name} doit être un HttpClientError`);
    }
  });

  it('chaque classe expose son propre nom via err.name', () => {
    assert.equal(new BadRequestError('').name, 'BadRequestError');
    assert.equal(new UnauthorizedError('').name, 'UnauthorizedError');
    assert.equal(new ForbiddenError('').name, 'ForbiddenError');
    assert.equal(new NotFoundError('').name, 'NotFoundError');
    assert.equal(new ConflictError('').name, 'ConflictError');
  });
});
