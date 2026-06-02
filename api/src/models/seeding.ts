import argon2 from 'argon2';
import { prisma } from './index.js';

async function seed() {
  const category = await prisma.category.create({
    data: {
      name: 'Film',
      description: 'Long-métrage cinématographique',
      image: 'https://placehold.co/400x300?text=Film',
    },
  });

  const user = await prisma.user.create({
    data: {
      username: 'chef_remy',
      email: 'remy@cinedelices.fr',
      password: await argon2.hash('Password1!'),
      role: 'ADMIN',
    },
  });

  const ingredient = await prisma.ingredient.create({
    data: {
      name: 'Tomate',
      image: 'https://placehold.co/100x100?text=Tomate',
    },
  });

  const thematic = await prisma.thematic.create({
    data: {
      name: 'Cuisine française',
      description: 'Recettes inspirées de la gastronomie française',
    },
  });

  const work = await prisma.work.create({
    data: {
      title: 'Ratatouille',
      releaseYear: 2007,
      synopsis: 'Un rat passionné de cuisine devient chef dans un grand restaurant parisien.',
      image: 'https://placehold.co/400x600?text=Ratatouille',
      categoryId: category.id,
    },
  });

  const recipe = await prisma.recipe.create({
    data: {
      title: 'Ratatouille de Rémy',
      description: 'La ratatouille confit façon Gusteau qui a ému le célèbre critique Anton Ego.',
      image: 'https://placehold.co/800x600?text=Ratatouille',
      prepTime: 30,
      cookTime: 60,
      servings: 4,
      difficulty: 'MEDIUM',
      state: 'APPROVED',
      userId: user.id,
      workId: work.id,
    },
  });

  await prisma.step.create({
    data: {
      order: 1,
      content: 'Trancher finement les légumes à la mandoline.',
      recipeId: recipe.id,
    },
  });

  await prisma.recipeIngredient.create({
    data: {
      recipeId: recipe.id,
      ingredientId: ingredient.id,
      quantity: 4,
      unit: 'pièces',
    },
  });

  await prisma.recipeThematic.create({
    data: {
      recipeId: recipe.id,
      thematicId: thematic.id,
    },
  });

  console.log('Seed terminé.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
