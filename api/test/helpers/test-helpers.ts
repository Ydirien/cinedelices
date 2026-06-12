/**
 * Fonctions utilitaires partagées par tous les tests d'intégration.
 * Permettent de créer rapidement des utilisateurs, recettes et tokens
 * sans dupliquer la logique dans chaque fichier de test.
 */
import argon2 from 'argon2';
import { prisma } from '../../src/models/index.ts';
import { generateAuthTokens } from '../../src/lib/tokens.ts';
import type { User } from '../../src/models/index.ts';

// Mot de passe valide utilisé par défaut pour tous les utilisateurs de test
export const TEST_PASSWORD = 'TestPassword123';

// Compteur global pour garantir l'unicité des emails et usernames entre tests
let counter = 0;
export function uniqueEmail(): string {
  return `test_${++counter}_${Date.now()}@example.com`;
}
export function uniqueUsername(): string {
  return `user_${++counter}_${Date.now()}`;
}

// Crée un utilisateur avec le rôle USER par défaut
export async function createUser(overrides?: {
  username?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
}): Promise<User> {
  const hash = await argon2.hash(TEST_PASSWORD);
  return prisma.user.create({
    data: {
      username: overrides?.username ?? uniqueUsername(),
      email: overrides?.email ?? uniqueEmail(),
      password: hash,
      role: overrides?.role ?? 'USER',
    },
  });
}

// Raccourci pour créer un administrateur
export async function createAdmin(overrides?: {
  username?: string;
  email?: string;
}): Promise<User> {
  return createUser({ ...overrides, role: 'ADMIN' });
}

// Génère un access token JWT valide pour un utilisateur
export function getAccessToken(user: User): string {
  return generateAuthTokens(user).accessToken.token;
}

// Retourne la valeur complète du header Authorization
export function bearerHeader(user: User): string {
  return `Bearer ${getAccessToken(user)}`;
}

// Crée une recette directement en base avec toutes ses relations
export async function createRecipe(
  userId: number,
  workId: number,
  ingredientId: number,
  thematicId: number,
  overrides?: {
    title?: string;
    state?: 'PENDING' | 'APPROVED' | 'REJECTED';
  },
) {
  return prisma.recipe.create({
    data: {
      title: overrides?.title ?? `Recette ${Date.now()}_${Math.random()}`,
      description: 'Une recette de test',
      image: 'https://example.com/recipe.jpg',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'EASY',
      state: overrides?.state ?? 'APPROVED',
      userId,
      workId,
      steps: { create: [{ order: 1, content: 'Première étape' }] },
      recipeIngredients: {
        create: [{ ingredientId, quantity: 1, unit: 'tasse' }],
      },
      thematics: { create: [{ thematicId }] },
    },
  });
}
