/**
 * Fichier chargé avant tous les tests d'intégration via --import.
 * - Nettoie la base de données de test avant la suite
 * - Sème les données de référence (catégorie, œuvre, ingrédient, thématique)
 *   dont tous les tests spec ont besoin
 * - Déconnecte Prisma après la suite
 */
import { before, after } from 'node:test';
import { prisma } from '../../src/models/index.ts';

// Objet partagé muté par before() et lu par les tests via import
export const testData: {
  category: { id: number; name: string; description: string; image: string } | null;
  work: { id: number; title: string } | null;
  ingredient: { id: number; name: string } | null;
  thematic: { id: number; name: string } | null;
} = {
  category: null,
  work: null,
  ingredient: null,
  thematic: null,
};

// Supprime toutes les données dans l'ordre qui respecte les FK
export async function cleanDatabase() {
  await prisma.recipeThematic.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.step.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();
  await prisma.work.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.thematic.deleteMany();
  await prisma.category.deleteMany();
}

before(async () => {
  await cleanDatabase();

  testData.category = await prisma.category.create({
    data: {
      name: 'Action',
      description: 'Films et séries d\'action',
      image: 'https://example.com/action.jpg',
    },
  });

  testData.work = await prisma.work.create({
    data: {
      title: 'Test Movie',
      releaseYear: 2020,
      synopsis: 'Un film de test pour les tests automatisés',
      image: 'https://example.com/movie.jpg',
      categoryId: testData.category.id,
    },
  });

  testData.ingredient = await prisma.ingredient.create({
    data: {
      name: 'Farine',
      image: 'https://example.com/flour.jpg',
    },
  });

  testData.thematic = await prisma.thematic.create({
    data: {
      name: 'Français',
      description: 'Cuisine française',
    },
  });
});

after(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});
