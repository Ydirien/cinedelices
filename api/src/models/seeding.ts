import argon2 from 'argon2';
import { prisma } from './index.js';

async function seed() {
  // Si les recettes existent déjà, le seed est complet — on ne re-seed pas
  const existingRecipes = await prisma.recipe.count();
  if (existingRecipes > 0) {
    console.log('Base déjà seedée, seed ignoré.');
    return;
  }

  // CATEGORIES
  const [catFilm, catSerie, catAnime, catDessinAnime] = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Film',
        description: 'Longs-métrages cinématographiques tous genres confondus.',
        image: 'https://placehold.co/400x300?text=Film',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Série',
        description: 'Séries de fiction diffusées à la télévision ou en streaming.',
        image: 'https://placehold.co/400x300?text=Serie',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Manga / Anime',
        description: "Œuvres japonaises issues de mangas et d'animes.",
        image: 'https://placehold.co/400x300?text=Anime',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dessin animé',
        description: 'Dessins animés parus au cinéma ou à la télévision.',
        image: 'https://placehold.co/400x300?text=Dessin+anime',
      },
    }),
  ]);

  // USERS — même mot de passe haché une seule fois pour alléger le seed
  const hashedPassword = await argon2.hash('Password1!');
  const [admin, julia, gusteau, soma] = await Promise.all([
    prisma.user.create({
      data: { username: 'chef_remy', email: 'remy@cinedelices.fr', password: hashedPassword, role: 'ADMIN' },
    }),
    prisma.user.create({
      data: { username: 'julia_child', email: 'julia@cinedelices.fr', password: hashedPassword, role: 'USER' },
    }),
    prisma.user.create({
      data: { username: 'gusteau_fan', email: 'gusteau@cinedelices.fr', password: hashedPassword, role: 'USER' },
    }),
    prisma.user.create({
      data: { username: 'soma_yukihira', email: 'soma@cinedelices.fr', password: hashedPassword, role: 'USER' },
    }),
  ]);

  // THEMATICS
  const [themAppetizer, themMainDish, themDessert, themBrevage] = await Promise.all([
    prisma.thematic.create({
      data: {
        name: 'Entrée',
        description: "Plats servis en début de repas pour ouvrir l'appétit.",
      },
    }),
    prisma.thematic.create({
      data: {
        name: 'Plat',
        description: 'Plats principaux du repas.',
      },
    }),
    prisma.thematic.create({
      data: {
        name: 'Dessert',
        description: 'Recettes sucrées servies en fin de repas.',
      },
    }),
    prisma.thematic.create({
      data: {
        name: 'Boisson',
        description: 'Boissons chaudes ou froides, alcoolisées ou non.',
      },
    }),
  ]);

  // INGREDIENTS — créés séquentiellement pour construire la map par nom
  const ingredientList = [
    { name: 'Tomate', image: 'https://placehold.co/100x100?text=Tomate' },
    { name: 'Courgette', image: 'https://placehold.co/100x100?text=Courgette' },
    { name: 'Aubergine', image: 'https://placehold.co/100x100?text=Aubergine' },
    { name: 'Poivron rouge', image: 'https://placehold.co/100x100?text=Poivron' },
    { name: 'Oignon', image: 'https://placehold.co/100x100?text=Oignon' },
    { name: 'Ail', image: 'https://placehold.co/100x100?text=Ail' },
    { name: 'Thym', image: 'https://placehold.co/100x100?text=Thym' },
    { name: "Huile d'olive", image: 'https://placehold.co/100x100?text=HuileOlive' },
    { name: 'Sel', image: 'https://placehold.co/100x100?text=Sel' },
    { name: 'Poivre noir', image: 'https://placehold.co/100x100?text=Poivre' },
    { name: 'Bœuf à braiser', image: 'https://placehold.co/100x100?text=Boeuf' },
    { name: 'Lardons', image: 'https://placehold.co/100x100?text=Lardons' },
    { name: 'Champignons de Paris', image: 'https://placehold.co/100x100?text=Champignon' },
    { name: 'Carotte', image: 'https://placehold.co/100x100?text=Carotte' },
    { name: 'Vin rouge', image: 'https://placehold.co/100x100?text=VinRouge' },
    { name: 'Farine', image: 'https://placehold.co/100x100?text=Farine' },
    { name: 'Beurre', image: 'https://placehold.co/100x100?text=Beurre' },
    { name: 'Laurier', image: 'https://placehold.co/100x100?text=Laurier' },
    { name: 'Pomme de terre', image: 'https://placehold.co/100x100?text=PdT' },
    { name: 'Jambon cuit', image: 'https://placehold.co/100x100?text=Jambon' },
    { name: 'Emmental', image: 'https://placehold.co/100x100?text=Emmental' },
    { name: 'Cornichons', image: 'https://placehold.co/100x100?text=Cornichon' },
    { name: 'Moutarde de Dijon', image: 'https://placehold.co/100x100?text=Moutarde' },
    { name: 'Pain de mie', image: 'https://placehold.co/100x100?text=PainMie' },
    { name: 'Porc effiloché', image: 'https://placehold.co/100x100?text=PorcEff' },
    { name: 'Bœuf tranché fin', image: 'https://placehold.co/100x100?text=BoeufFin' },
    { name: 'Sauce soja', image: 'https://placehold.co/100x100?text=SauceSoja' },
    { name: 'Mirin', image: 'https://placehold.co/100x100?text=Mirin' },
    { name: 'Saké de cuisine', image: 'https://placehold.co/100x100?text=Sake' },
    { name: 'Riz japonais', image: 'https://placehold.co/100x100?text=Riz' },
    { name: 'Oeuf', image: 'https://placehold.co/100x100?text=Oeuf' },
    { name: 'Dashi', image: 'https://placehold.co/100x100?text=Dashi' },
    { name: 'Ciboulette', image: 'https://placehold.co/100x100?text=Ciboulette' },
    { name: 'Nouilles ramen', image: 'https://placehold.co/100x100?text=Ramen' },
    { name: 'Poitrine de porc', image: 'https://placehold.co/100x100?text=Poitrine' },
    { name: 'Mais en grains', image: 'https://placehold.co/100x100?text=Mais' },
    { name: 'Feuille de nori', image: 'https://placehold.co/100x100?text=Nori' },
    { name: 'Bouillon de porc', image: 'https://placehold.co/100x100?text=Bouillon' },
    { name: 'Pate brisee', image: 'https://placehold.co/100x100?text=PateBrisee' },
    { name: 'Creme fraiche', image: 'https://placehold.co/100x100?text=CremeFraiche' },
    { name: 'Fromage de chevre', image: 'https://placehold.co/100x100?text=Chevre' },
    { name: 'Dinde rotie', image: 'https://placehold.co/100x100?text=Dinde' },
    { name: 'Sauce cranberry', image: 'https://placehold.co/100x100?text=Cranberry' },
    { name: 'Farce aux herbes', image: 'https://placehold.co/100x100?text=Farce' },
    { name: 'Chocolat noir 70', image: 'https://placehold.co/100x100?text=Chocolat' },
    { name: 'Creme liquide', image: 'https://placehold.co/100x100?text=CremeL' },
    { name: 'Sucre', image: 'https://placehold.co/100x100?text=Sucre' },
    { name: 'Piment chipotle', image: 'https://placehold.co/100x100?text=Chipotle' },
    { name: 'Miel', image: 'https://placehold.co/100x100?text=Miel' },
    { name: 'Amandes effilees', image: 'https://placehold.co/100x100?text=Amandes' },
    
    { name: 'Caille', image: 'https://placehold.co/100x100?text=Caille' },
    { name: 'Pate feuilletee', image: 'https://placehold.co/100x100?text=PateFeuilletee' },
    { name: 'Foie gras', image: 'https://placehold.co/100x100?text=FoieGras' },
    { name: 'Truffe noire', image: 'https://placehold.co/100x100?text=Truffe' },
    { name: 'Echalote', image: 'https://placehold.co/100x100?text=Echalote' },
    { name: 'Madere', image: 'https://placehold.co/100x100?text=Madere' },
    { name: 'Fond de veau', image: 'https://placehold.co/100x100?text=FondVeau' },
    { name: 'Gousse de vanille', image: 'https://placehold.co/100x100?text=Vanille' },
    { name: 'Cassonade', image: 'https://placehold.co/100x100?text=Cassonade' },
    { name: 'Eau gazeuse', image: 'https://placehold.co/100x100?text=EauGaz' },
    { name: 'Extrait de vanille', image: 'https://placehold.co/100x100?text=ExtraitVanille' },
    { name: 'Lait', image: 'https://placehold.co/100x100?text=Lait' },
    { name: 'Levure chimique', image: 'https://placehold.co/100x100?text=Levure' },
    { name: 'Cuisses de poulet', image: 'https://placehold.co/100x100?text=Poulet' },
    { name: 'Babeurre', image: 'https://placehold.co/100x100?text=Babeurre' },
    { name: 'Paprika', image: 'https://placehold.co/100x100?text=Paprika' },
    { name: 'Piment de Cayenne', image: 'https://placehold.co/100x100?text=Cayenne' },
    { name: 'Huile de friture', image: 'https://placehold.co/100x100?text=HuileFrit' },
    { name: 'Saumon', image: 'https://placehold.co/100x100?text=Saumon' },
    { name: 'Umeboshi', image: 'https://placehold.co/100x100?text=Umeboshi' },
    { name: 'Cote de boeuf', image: 'https://placehold.co/100x100?text=CoteBoeuf' },
    { name: 'Levure boulangere', image: 'https://placehold.co/100x100?text=LevureBoul' },
    { name: 'Sucre glace', image: 'https://placehold.co/100x100?text=SucreGlace' },
    { name: "Sirop d'erable", image: 'https://placehold.co/100x100?text=SiropErable' },
  ];

  const ingMap: Record<string, { id: number }> = {};
  for (const data of ingredientList) {
    ingMap[data.name] = await prisma.ingredient.create({ data });
  }

  const ing = (name: string) => {
    if (!ingMap[name]) throw new Error(`Ingrédient manquant dans ingredientList : "${name}"`);
    return ingMap[name].id;
  };

  // =========================================================
  // FILM 1 — Ratatouille
  // =========================================================
  const workRatatouille = await prisma.work.create({
    data: {
      title: 'Ratatouille',
      releaseYear: 2007,
      synopsis: "Un rat passionné de cuisine devient chef à l'Auberge Gusteau, le meilleur restaurant de Paris.",
      image: 'https://images.pexels.com/photos/7439978/pexels-photo-7439978.jpeg',
      categoryId: catFilm.id,
    },
  });

  const recRatatouille = await prisma.recipe.create({
    data: {
      title: 'Ratatouille confite de Rémy',
      description:
        'La célèbre ratatouille confite qui a fait chavirer le cœur du critique Anton Ego. Fines tranches de légumes en rosace sur un coulis de tomate parfumé au thym.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Ratatouille_NIH.jpg',
      prepTime: 45,
      cookTime: 90,
      servings: 4,
      difficulty: 'HARD',
      state: 'APPROVED',
      userId: admin.id,
      workId: workRatatouille.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content:
            "Coulis : mixer 4 tomates pelées avec 2 gousses d'ail et l'oignon. Réduire 20 min à feu doux avec un filet d'huile d'olive. Saler, poivrer.",
          recipeId: recRatatouille.id,
        },
        {
          order: 2,
          content:
            'Trancher à la mandoline les courgettes, aubergines, tomates et poivrons en rondelles de 2-3 mm. La régularité est essentielle pour une cuisson homogène.',
          recipeId: recRatatouille.id,
        },
        {
          order: 3,
          content:
            'Napper le fond du plat avec le coulis. Disposer les légumes en rosace alternée en les faisant se chevaucher légèrement.',
          recipeId: recRatatouille.id,
        },
        {
          order: 4,
          content:
            "Assaisonner avec sel, poivre, thym et un filet d'huile d'olive. Couvrir d'un papier sulfurisé découpé aux dimensions du plat.",
          recipeId: recRatatouille.id,
        },
        {
          order: 5,
          content:
            "Cuire à 135°C pendant 1h30. Les légumes doivent être fondants et légèrement caramélisés. Servir en rosace à l'assiette.",
          recipeId: recRatatouille.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recRatatouille.id, ingredientId: ing('Tomate'), quantity: 6, unit: 'pièces' },
        { recipeId: recRatatouille.id, ingredientId: ing('Courgette'), quantity: 3, unit: 'pièces' },
        { recipeId: recRatatouille.id, ingredientId: ing('Aubergine'), quantity: 2, unit: 'pièces' },
        { recipeId: recRatatouille.id, ingredientId: ing('Poivron rouge'), quantity: 2, unit: 'pièces' },
        { recipeId: recRatatouille.id, ingredientId: ing('Oignon'), quantity: 1, unit: 'pièce' },
        { recipeId: recRatatouille.id, ingredientId: ing('Ail'), quantity: 4, unit: 'gousses' },
        { recipeId: recRatatouille.id, ingredientId: ing('Thym'), quantity: 3, unit: 'branches' },
        { recipeId: recRatatouille.id, ingredientId: ing("Huile d'olive"), quantity: 4, unit: 'cs' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recRatatouille.id, thematicId: themAppetizer.id } }),
  ]);

  // =========================================================
  // FILM 2 — Julie & Julia
  // =========================================================
  const workJulieJulia = await prisma.work.create({
    data: {
      title: 'Julie & Julia',
      releaseYear: 2009,
      synopsis:
        'Julie Powell cuisine les 524 recettes de Julia Child en 365 jours, en parallèle de la vie de la cuisinière en France dans les années 50.',
      image: 'https://images.pexels.com/photos/34636420/pexels-photo-34636420.jpeg',
      categoryId: catFilm.id,
    },
  });

  const recBourguignon = await prisma.recipe.create({
    data: {
      title: 'Bœuf bourguignon de Julia Child',
      description:
        "Le plat emblématique du livre « Mastering the Art of French Cooking ». Braisé de bœuf au Bourgogne, lardons et champignons, mijoté jusqu'à la perfection absolue.",
      image: 'https://images.pexels.com/photos/34636420/pexels-photo-34636420.jpeg',
      prepTime: 40,
      cookTime: 180,
      servings: 6,
      difficulty: 'MEDIUM',
      state: 'APPROVED',
      userId: julia.id,
      workId: workJulieJulia.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content:
            'Sécher la viande au papier absorbant. Faire revenir les lardons dans le beurre en cocotte, réserver. Faire dorer le bœuf en plusieurs fois à feu vif.',
          recipeId: recBourguignon.id,
        },
        {
          order: 2,
          content:
            "Dans la cocotte, faire suer l'oignon et les carottes. Saupoudrer de farine et cuire 2 min (singer). Remettre viande et lardons.",
          recipeId: recBourguignon.id,
        },
        {
          order: 3,
          content:
            "Mouiller avec le vin rouge jusqu'à hauteur. Ajouter le laurier et le thym. Porter à ébullition, couvrir, enfourner à 160°C pendant 2h30.",
          recipeId: recBourguignon.id,
        },
        {
          order: 4,
          content:
            "Faire sauter les champignons dans le beurre à feu vif. Les incorporer 30 min avant la fin. Rectifier l'assaisonnement. Servir avec des pommes de terre vapeur.",
          recipeId: recBourguignon.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recBourguignon.id, ingredientId: ing('Bœuf à braiser'), quantity: 1200, unit: 'g' },
        { recipeId: recBourguignon.id, ingredientId: ing('Lardons'), quantity: 200, unit: 'g' },
        { recipeId: recBourguignon.id, ingredientId: ing('Champignons de Paris'), quantity: 300, unit: 'g' },
        { recipeId: recBourguignon.id, ingredientId: ing('Carotte'), quantity: 3, unit: 'pièces' },
        { recipeId: recBourguignon.id, ingredientId: ing('Oignon'), quantity: 2, unit: 'pièces' },
        { recipeId: recBourguignon.id, ingredientId: ing('Ail'), quantity: 3, unit: 'gousses' },
        { recipeId: recBourguignon.id, ingredientId: ing('Vin rouge'), quantity: 75, unit: 'cl' },
        { recipeId: recBourguignon.id, ingredientId: ing('Farine'), quantity: 2, unit: 'cs' },
        { recipeId: recBourguignon.id, ingredientId: ing('Beurre'), quantity: 50, unit: 'g' },
        { recipeId: recBourguignon.id, ingredientId: ing('Laurier'), quantity: 2, unit: 'feuilles' },
        { recipeId: recBourguignon.id, ingredientId: ing('Thym'), quantity: 2, unit: 'branches' },
        { recipeId: recBourguignon.id, ingredientId: ing('Pomme de terre'), quantity: 800, unit: 'g' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recBourguignon.id, thematicId: themMainDish.id } }),
  ]);

  // =========================================================
  // FILM 3 — Chef
  // =========================================================
  const workChef = await prisma.work.create({
    data: {
      title: 'Chef',
      releaseYear: 2014,
      synopsis:
        'Un chef renommé quitte son restaurant pour ouvrir un food truck et retrouver sa créativité en parcourant les États-Unis avec son fils.',
      image: 'https://images.pexels.com/photos/9751155/pexels-photo-9751155.jpeg',
      categoryId: catFilm.id,
    },
  });

  const recCubano = await prisma.recipe.create({
    data: {
      title: 'Cubano sandwich de Carl Casper',
      description:
        'Le sandwich iconique du food truck. Porc effiloché, jambon, emmental fondant, cornichons croquants et moutarde entre deux tranches de pain pressées à la perfection.',
      image: 'https://images.pexels.com/photos/9751155/pexels-photo-9751155.jpeg',
      prepTime: 15,
      cookTime: 10,
      servings: 2,
      difficulty: 'EASY',
      state: 'APPROVED',
      userId: gusteau.id,
      workId: workChef.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content: 'Tartiner généreusement les faces intérieures du pain avec la moutarde de Dijon.',
          recipeId: recCubano.id,
        },
        {
          order: 2,
          content:
            "Garnir avec les tranches de jambon, le porc effiloché réchauffé, les rondelles de cornichons et les tranches d'emmental.",
          recipeId: recCubano.id,
        },
        {
          order: 3,
          content:
            "Faire fondre le beurre dans une poêle à feu moyen. Déposer le sandwich et appuyer avec une spatule ou un poids. Cuire 3-4 min par face jusqu'à pain doré et fromage fondu.",
          recipeId: recCubano.id,
        },
        {
          order: 4,
          content: 'Couper en diagonale. Servir immédiatement — le fromage doit filer et le pain craquer sous la dent.',
          recipeId: recCubano.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recCubano.id, ingredientId: ing('Pain de mie'), quantity: 4, unit: 'tranches épaisses' },
        { recipeId: recCubano.id, ingredientId: ing('Jambon cuit'), quantity: 6, unit: 'tranches' },
        { recipeId: recCubano.id, ingredientId: ing('Porc effiloché'), quantity: 200, unit: 'g' },
        { recipeId: recCubano.id, ingredientId: ing('Emmental'), quantity: 4, unit: 'tranches' },
        { recipeId: recCubano.id, ingredientId: ing('Cornichons'), quantity: 6, unit: 'pièces' },
        { recipeId: recCubano.id, ingredientId: ing('Moutarde de Dijon'), quantity: 2, unit: 'cs' },
        { recipeId: recCubano.id, ingredientId: ing('Beurre'), quantity: 20, unit: 'g' },
      ],
    }),
    prisma.recipeThematic.createMany({
      data: [
        { recipeId: recCubano.id, thematicId: themMainDish.id },

      ],
    }),
  ]);

  // =========================================================
  // FILM 4 — Chocolat
  // =========================================================
  const workChocolat = await prisma.work.create({
    data: {
      title: 'Chocolat',
      releaseYear: 2000,
      synopsis:
        'Vianne Thierry ouvre une chocolaterie dans un village conservateur français, bousculant les habitants en plein Carême.',
      image: 'https://images.pexels.com/photos/691147/pexels-photo-691147.jpeg',
      categoryId: catFilm.id,
    },
  });

  const recChocolat = await prisma.recipe.create({
    data: {
      title: 'Mousse au chocolat noir de Vianne',
      description:
        'La mousse au chocolat diaboliquement fondante de Vianne Thierry, avec une touche de piment chipotle pour réchauffer les âmes les plus froides du village.',
      image: 'https://images.pexels.com/photos/691147/pexels-photo-691147.jpeg',
      prepTime: 20,
      cookTime: 5,
      servings: 6,
      difficulty: 'EASY',
      state: 'PENDING',
      userId: admin.id,
      workId: workChocolat.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content:
            'Faire fondre le chocolat noir au bain-marie avec la crème liquide chaude. Ajouter une pincée de chipotle. Laisser tiédir à 35°C.',
          recipeId: recChocolat.id,
        },
        {
          order: 2,
          content: "Incorporer les jaunes d'œufs un par un au chocolat fondu en fouettant énergiquement.",
          recipeId: recChocolat.id,
        },
        {
          order: 3,
          content:
            'Monter les blancs en neige ferme avec le sucre. Les incorporer délicatement en trois fois par mouvements enveloppants pour ne pas les casser.',
          recipeId: recChocolat.id,
        },
        {
          order: 4,
          content:
            "Répartir dans des verrines et réfrigérer au minimum 3 heures. Décorer d'un copeau de chocolat noir avant de servir.",
          recipeId: recChocolat.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recChocolat.id, ingredientId: ing('Chocolat noir 70'), quantity: 200, unit: 'g' },
        { recipeId: recChocolat.id, ingredientId: ing('Creme liquide'), quantity: 10, unit: 'cl' },
        { recipeId: recChocolat.id, ingredientId: ing('Oeuf'), quantity: 4, unit: 'pièces' },
        { recipeId: recChocolat.id, ingredientId: ing('Sucre'), quantity: 30, unit: 'g' },
        { recipeId: recChocolat.id, ingredientId: ing('Piment chipotle'), quantity: 1, unit: 'pincée' },
      ],
    }),
    prisma.recipeThematic.create({
      data: { recipeId: recChocolat.id, thematicId: themDessert.id },
    }),
  ]);

  // =========================================================
  // SÉRIE 1 — Game of Thrones
  // =========================================================
  const workGOT = await prisma.work.create({
    data: {
      title: 'Game of Thrones',
      releaseYear: 2011,
      synopsis:
        'Dans les royaumes de Westeros, de grandes familles se disputent le Trône de Fer dans une guerre épique mêlant politique, trahison et magie.',
      image: 'https://placehold.co/400x600?text=GoT',
      categoryId: catSerie.id,
    },
  });

  const recTourte = await prisma.recipe.create({
    data: {
      title: 'Tourte médiévale aux champignons et chèvre',
      description:
        'Inspirée des fastueux banquets de Port-Réal. Pâte dorée et croustillante, garnie de champignons sauvages, fromage de chèvre fondant et crème fraîche.',
      image: 'https://placehold.co/600x400?text=Tourte+Médiévale',
      prepTime: 30,
      cookTime: 45,
      servings: 6,
      difficulty: 'MEDIUM',
      state: 'APPROVED',
      userId: julia.id,
      workId: workGOT.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content:
            "Faire revenir les champignons tranchés dans le beurre avec l'ail et le thym jusqu'à évaporation totale de l'eau de végétation. Saler, poivrer. Réserver.",
          recipeId: recTourte.id,
        },
        {
          order: 2,
          content:
            "Mélanger les champignons refroidis avec la crème fraîche, le chèvre émietté et 2 œufs battus. Rectifier l'assaisonnement.",
          recipeId: recTourte.id,
        },
        {
          order: 3,
          content: 'Foncer un moule à tarte avec les 2/3 de la pâte brisée. Piquer le fond. Verser la garniture.',
          recipeId: recTourte.id,
        },
        {
          order: 4,
          content:
            "Couvrir avec le reste de pâte, souder les bords, dorer à l'œuf battu. Pratiquer une cheminée au centre. Cuire à 180°C pendant 40-45 min.",
          recipeId: recTourte.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recTourte.id, ingredientId: ing('Pate brisee'), quantity: 500, unit: 'g' },
        { recipeId: recTourte.id, ingredientId: ing('Champignons de Paris'), quantity: 500, unit: 'g' },
        { recipeId: recTourte.id, ingredientId: ing('Creme fraiche'), quantity: 20, unit: 'cl' },
        { recipeId: recTourte.id, ingredientId: ing('Fromage de chevre'), quantity: 150, unit: 'g' },
        { recipeId: recTourte.id, ingredientId: ing('Oeuf'), quantity: 3, unit: 'pièces' },
        { recipeId: recTourte.id, ingredientId: ing('Ail'), quantity: 2, unit: 'gousses' },
        { recipeId: recTourte.id, ingredientId: ing('Thym'), quantity: 2, unit: 'branches' },
        { recipeId: recTourte.id, ingredientId: ing('Beurre'), quantity: 30, unit: 'g' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recTourte.id, thematicId: themMainDish.id } }),
  ]);

  // =========================================================
  // SÉRIE 2 — Friends
  // =========================================================
  const workFriends = await prisma.work.create({
    data: {
      title: 'Friends',
      releaseYear: 1994,
      synopsis:
        "Six amis new-yorkais naviguent ensemble à travers les hauts et les bas de la vie adulte, de l'amour et du travail à Manhattan.",
      image: 'https://placehold.co/400x600?text=Friends',
      categoryId: catSerie.id,
    },
  });

  const recMoistMaker = await prisma.recipe.create({
    data: {
      title: 'Le "Moist Maker" de Ross Geller',
      description:
        'Le sandwich de Thanksgiving le plus célèbre de la télévision. La tranche centrale imbibée de jus de dinde — le fameux Moist Maker — fait toute la différence. On ne rigole pas avec le sandwich de Ross.',
      image: 'https://placehold.co/600x400?text=Moist+Maker+Ross+Geller',
      prepTime: 10,
      cookTime: 0,
      servings: 1,
      difficulty: 'EASY',
      state: 'PENDING',
      userId: gusteau.id,
      workId: workFriends.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content:
            "Tremper généreusement une tranche de pain de mie dans le jus de cuisson de la dinde encore chaud. C'est le Moist Maker. Réserver.",
          recipeId: recMoistMaker.id,
        },
        {
          order: 2,
          content: 'Tartiner les deux tranches extérieures avec la sauce cranberry des deux côtés.',
          recipeId: recMoistMaker.id,
        },
        {
          order: 3,
          content: 'Garnir la première tranche avec de généreuses tranches de dinde rôtie et la farce aux herbes.',
          recipeId: recMoistMaker.id,
        },
        {
          order: 4,
          content:
            "Poser le Moist Maker au centre, compléter avec une autre couche de dinde, refermer. Couper proprement. Ne JAMAIS laisser quelqu'un d'autre manger ce sandwich.",
          recipeId: recMoistMaker.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recMoistMaker.id, ingredientId: ing('Pain de mie'), quantity: 3, unit: 'tranches' },
        { recipeId: recMoistMaker.id, ingredientId: ing('Dinde rotie'), quantity: 200, unit: 'g' },
        { recipeId: recMoistMaker.id, ingredientId: ing('Farce aux herbes'), quantity: 100, unit: 'g' },
        { recipeId: recMoistMaker.id, ingredientId: ing('Sauce cranberry'), quantity: 3, unit: 'cs' },
      ],
    }),
    prisma.recipeThematic.createMany({
      data: [
        { recipeId: recMoistMaker.id, thematicId: themMainDish.id },
      ],
    }),
  ]);

  // =========================================================
  // ANIME 1 — Shokugeki no Soma
  // =========================================================
  const workFoodWars = await prisma.work.create({
    data: {
      title: 'Shokugeki no Soma',
      releaseYear: 2015,
      synopsis:
        "Soma Yukihira intègre l'élite de l'académie culinaire Totsuki pour devenir le meilleur chef du monde lors de duels gastronomiques.",
      image: 'https://placehold.co/400x600?text=Food+Wars',
      categoryId: catAnime.id,
    },
  });

  const recGyudon = await prisma.recipe.create({
    data: {
      title: 'Gyudon de Soma Yukihira',
      description:
        "Le bol de bœuf qui a vaincu les élites de Totsuki. Fines tranches de bœuf et oignons dans un tsuyu sucré-salé sur riz vapeur, couronné d'un œuf onsen fondant.",
      image: 'https://images.pexels.com/photos/31303467/pexels-photo-31303467.jpeg',
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      difficulty: 'EASY',
      state: 'APPROVED',
      userId: soma.id,
      workId: workFoodWars.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content:
            "Cuire le riz japonais : rincer 3 fois, 1 volume riz pour 1,2 d'eau froide, porter à ébullition, couvrir et cuire 12 min à feu doux, reposer 10 min hors feu.",
          recipeId: recGyudon.id,
        },
        {
          order: 2,
          content:
            "Dans une casserole, mélanger dashi, sauce soja, mirin et saké. Porter à frémissement. Ajouter l'oignon émincé et cuire 5 min.",
          recipeId: recGyudon.id,
        },
        {
          order: 3,
          content:
            "Ajouter les tranches de bœuf très fines dans le bouillon frémissant. Cuire 2-3 min. Le bœuf s'imprègne de la sauce.",
          recipeId: recGyudon.id,
        },
        {
          order: 4,
          content:
            'Servir le riz dans un grand bol. Napper du bœuf et de sa sauce. Poser délicatement un œuf onsen (63°C / 1h) sur le dessus. Parsemer de ciboulette ciselée.',
          recipeId: recGyudon.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recGyudon.id, ingredientId: ing('Bœuf tranché fin'), quantity: 300, unit: 'g' },
        { recipeId: recGyudon.id, ingredientId: ing('Riz japonais'), quantity: 300, unit: 'g' },
        { recipeId: recGyudon.id, ingredientId: ing('Oignon'), quantity: 1, unit: 'pièce' },
        { recipeId: recGyudon.id, ingredientId: ing('Dashi'), quantity: 20, unit: 'cl' },
        { recipeId: recGyudon.id, ingredientId: ing('Sauce soja'), quantity: 3, unit: 'cs' },
        { recipeId: recGyudon.id, ingredientId: ing('Mirin'), quantity: 3, unit: 'cs' },
        { recipeId: recGyudon.id, ingredientId: ing('Saké de cuisine'), quantity: 2, unit: 'cs' },
        { recipeId: recGyudon.id, ingredientId: ing('Oeuf'), quantity: 2, unit: 'pièces' },
        { recipeId: recGyudon.id, ingredientId: ing('Ciboulette'), quantity: 3, unit: 'brins' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recGyudon.id, thematicId: themMainDish.id } }),
  ]);

  // =========================================================
  // ANIME 2 — Naruto
  // =========================================================
  const workNaruto = await prisma.work.create({
    data: {
      title: 'Naruto',
      releaseYear: 2002,
      synopsis:
        'Naruto Uzumaki, jeune ninja portant un démon renard en lui, rêve de devenir Hokage, le chef suprême de son village.',
      image: 'https://placehold.co/400x600?text=Naruto',
      categoryId: catAnime.id,
    },
  });

  const recRamen = await prisma.recipe.create({
    data: {
      title: 'Ramen Ichiraku de Naruto',
      description:
        'Le ramen préféré de Naruto, servi chez Ichiraku Ramen à Konoha. Bouillon de porc intense et fumé, chashu fondant, œuf mariné, nori et maïs.',
      image: 'https://images.pexels.com/photos/31393444/pexels-photo-31393444.jpeg',
      prepTime: 30,
      cookTime: 240,
      servings: 2,
      difficulty: 'HARD',
      state: 'PENDING',
      userId: soma.id,
      workId: workNaruto.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content:
            "Bouillon : blanchir la poitrine de porc 5 min, jeter l'eau. Recommencer avec 1,5 L d'eau fraîche, oignon et ail. Mijoter 3h à frémissement. Assaisonner avec sauce soja et sel.",
          recipeId: recRamen.id,
        },
        {
          order: 2,
          content:
            'Chashu : ficeler la poitrine. Faire revenir dans sauce soja, mirin, saké. Couvrir et mijoter 1h30 en retournant toutes les 30 min. Refroidir et trancher finement.',
          recipeId: recRamen.id,
        },
        {
          order: 3,
          content:
            "Oeufs marinés : cuire 6 min 30 à l'eau bouillante, choc thermique, écaler. Mariner 12h dans sauce soja + mirin + eau (1:1:1).",
          recipeId: recRamen.id,
        },
        {
          order: 4,
          content: 'Cuire les nouilles ramen selon le paquet. Les disposer dans un grand bol chaud.',
          recipeId: recRamen.id,
        },
        {
          order: 5,
          content:
            "Verser le bouillon brûlant. Garnir avec le chashu tranché, l'œuf coupé en deux, les feuilles de nori, le maïs et la ciboulette ciselée.",
          recipeId: recRamen.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recRamen.id, ingredientId: ing('Nouilles ramen'), quantity: 200, unit: 'g' },
        { recipeId: recRamen.id, ingredientId: ing('Poitrine de porc'), quantity: 500, unit: 'g' },
        { recipeId: recRamen.id, ingredientId: ing('Bouillon de porc'), quantity: 1.5, unit: 'L' },
        { recipeId: recRamen.id, ingredientId: ing('Sauce soja'), quantity: 5, unit: 'cs' },
        { recipeId: recRamen.id, ingredientId: ing('Mirin'), quantity: 3, unit: 'cs' },
        { recipeId: recRamen.id, ingredientId: ing('Saké de cuisine'), quantity: 2, unit: 'cs' },
        { recipeId: recRamen.id, ingredientId: ing('Oeuf'), quantity: 2, unit: 'pièces' },
        { recipeId: recRamen.id, ingredientId: ing('Feuille de nori'), quantity: 2, unit: 'feuilles' },
        { recipeId: recRamen.id, ingredientId: ing('Ciboulette'), quantity: 4, unit: 'brins' },
        { recipeId: recRamen.id, ingredientId: ing('Mais en grains'), quantity: 50, unit: 'g' },
        { recipeId: recRamen.id, ingredientId: ing('Oignon'), quantity: 1, unit: 'pièce' },
        { recipeId: recRamen.id, ingredientId: ing('Ail'), quantity: 4, unit: 'gousses' },
      ],
    }),
    prisma.recipeThematic.createMany({
      data: [
        { recipeId: recRamen.id, thematicId: themMainDish.id },
      ],
    }),
  ]);

  // =========================================================
  // DESSIN ANIMÉ — Winnie l'Ourson
  // =========================================================
  const workWinnie = await prisma.work.create({
    data: {
      title: "Winnie l'Ourson",
      releaseYear: 1966,
      synopsis:
        "Dans la Forêt des Rêves Bleus, Winnie l'Ourson et ses amis vivent de douces aventures. Winnie, lui, ne vit que pour le miel.",
      image: 'https://placehold.co/400x600?text=Winnie',
      categoryId: catDessinAnime.id,
    },
  });

  const recWinnie = await prisma.recipe.create({
    data: {
      title: "Cake au miel façon Winnie l'Ourson",
      description:
        "Doux comme un câlin de nounours. Un cake moelleux au beurre noisette et au miel doré, parsemé d'amandes effilées, aussi réconfortant que les aventures dans les Cent Acres.",
      image: 'https://images.pexels.com/photos/12106434/pexels-photo-12106434.jpeg',
      prepTime: 15,
      cookTime: 45,
      servings: 8,
      difficulty: 'EASY',
      state: 'APPROVED',
      userId: admin.id,
      workId: workWinnie.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        {
          order: 1,
          content:
            "Préchauffer le four à 170°C. Faire fondre le beurre jusqu'à obtenir un beurre noisette (légèrement doré et parfumé de noisette). Laisser tiédir.",
          recipeId: recWinnie.id,
        },
        {
          order: 2,
          content:
            "Fouetter les œufs avec le sucre jusqu'à blanchiment. Ajouter le miel et le beurre noisette. Bien mélanger.",
          recipeId: recWinnie.id,
        },
        {
          order: 3,
          content:
            "Incorporer la farine tamisée et mélanger jusqu'à homogénéité. Verser dans un moule à cake beurré et fariné.",
          recipeId: recWinnie.id,
        },
        {
          order: 4,
          content:
            "Parsemer généreusement d'amandes effilées. Cuire 40-45 min. Laisser refroidir avant de démouler. Napper d'un filet de miel chaud au moment de servir.",
          recipeId: recWinnie.id,
        },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recWinnie.id, ingredientId: ing('Farine'), quantity: 200, unit: 'g' },
        { recipeId: recWinnie.id, ingredientId: ing('Oeuf'), quantity: 3, unit: 'pièces' },
        { recipeId: recWinnie.id, ingredientId: ing('Sucre'), quantity: 80, unit: 'g' },
        { recipeId: recWinnie.id, ingredientId: ing('Beurre'), quantity: 120, unit: 'g' },
        { recipeId: recWinnie.id, ingredientId: ing('Miel'), quantity: 120, unit: 'g' },
        { recipeId: recWinnie.id, ingredientId: ing('Amandes effilees'), quantity: 50, unit: 'g' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recWinnie.id, thematicId: themDessert.id } }),
  ]);

  // =========================================================
  // FILM 5 — Le Festin de Babette
  // =========================================================
  const workBabette = await prisma.work.create({
    data: {
      title: 'Le Festin de Babette',
      releaseYear: 1987,
      synopsis:
        "Babette, réfugiée française, dépense ses gains de loterie pour offrir un festin gastronomique inoubliable à un village austère du Jutland.",
      image: 'https://placehold.co/400x600?text=Babette',
      categoryId: catFilm.id,
    },
  });

  const recCailles = await prisma.recipe.create({
    data: {
      title: 'Cailles en sarcophage de Babette',
      description:
        "Le plat-vedette du festin : des cailles farcies au foie gras et à la truffe, nichées dans un écrin de pâte feuilletée et nappées d'une sauce au Madère.",
      image: 'https://www.jackiecuisine.com/wp-content/uploads/caille-sarcophage-5w-774x516.jpg',
      prepTime: 60,
      cookTime: 40,
      servings: 4,
      difficulty: 'HARD',
      state: 'APPROVED',
      userId: julia.id,
      workId: workBabette.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        { order: 1, content: "Désosser les cailles, les farcir d'un morceau de foie gras et de truffe. Saler, poivrer, brider.", recipeId: recCailles.id },
        { order: 2, content: "Saisir les cailles au beurre sur toutes les faces. Réserver. Faire suer l'échalote dans la même poêle.", recipeId: recCailles.id },
        { order: 3, content: "Déglacer au Madère, ajouter le fond de veau, réduire de moitié pour obtenir une sauce nappante.", recipeId: recCailles.id },
        { order: 4, content: "Tailler des sarcophages dans la pâte feuilletée, y déposer chaque caille, dorer à l'œuf. Cuire à 200°C 20-25 min. Servir nappé de sauce.", recipeId: recCailles.id },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recCailles.id, ingredientId: ing('Caille'), quantity: 4, unit: 'pièces' },
        { recipeId: recCailles.id, ingredientId: ing('Pate feuilletee'), quantity: 500, unit: 'g' },
        { recipeId: recCailles.id, ingredientId: ing('Foie gras'), quantity: 120, unit: 'g' },
        { recipeId: recCailles.id, ingredientId: ing('Truffe noire'), quantity: 1, unit: 'pièce' },
        { recipeId: recCailles.id, ingredientId: ing('Echalote'), quantity: 2, unit: 'pièces' },
        { recipeId: recCailles.id, ingredientId: ing('Madere'), quantity: 10, unit: 'cl' },
        { recipeId: recCailles.id, ingredientId: ing('Fond de veau'), quantity: 25, unit: 'cl' },
        { recipeId: recCailles.id, ingredientId: ing('Beurre'), quantity: 40, unit: 'g' },
        { recipeId: recCailles.id, ingredientId: ing('Oeuf'), quantity: 1, unit: 'pièce' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recCailles.id, thematicId: themMainDish.id } }),
  ]);

  // =========================================================
  // FILM 6 — Amélie
  // =========================================================
  const workAmelie = await prisma.work.create({
    data: {
      title: 'Le Fabuleux Destin d\'Amélie Poulain',
      releaseYear: 2001,
      synopsis:
        "Amélie, jeune serveuse montmartroise, décide de changer discrètement la vie des gens qui l'entourent, tout en cherchant l'amour.",
      image: 'https://placehold.co/400x600?text=Amelie',
      categoryId: catFilm.id,
    },
  });

  const recCremeBrulee = await prisma.recipe.create({
    data: {
      title: 'Crème brûlée d\'Amélie',
      description:
        "Le plaisir simple préféré d'Amélie : craquer la fine croûte de caramel à la petite cuillère pour révéler une crème vanillée d'une douceur infinie.",
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Br%C3%BBl%C3%A9e.jpg',
      prepTime: 20,
      cookTime: 50,
      servings: 4,
      difficulty: 'MEDIUM',
      state: 'APPROVED',
      userId: admin.id,
      workId: workAmelie.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        { order: 1, content: "Fendre la gousse de vanille, gratter les graines, infuser le tout dans la crème liquide chaude 15 min.", recipeId: recCremeBrulee.id },
        { order: 2, content: "Fouetter les jaunes d'œufs avec le sucre sans blanchir. Verser la crème chaude filtrée dessus en mélangeant doucement.", recipeId: recCremeBrulee.id },
        { order: 3, content: "Répartir dans des ramequins. Cuire au bain-marie à 100°C pendant 45-50 min : la crème doit être prise mais encore tremblotante.", recipeId: recCremeBrulee.id },
        { order: 4, content: "Réfrigérer au moins 4h. Saupoudrer de cassonade et caraméliser au chalumeau juste avant de servir.", recipeId: recCremeBrulee.id },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recCremeBrulee.id, ingredientId: ing('Creme liquide'), quantity: 50, unit: 'cl' },
        { recipeId: recCremeBrulee.id, ingredientId: ing('Oeuf'), quantity: 5, unit: 'jaunes' },
        { recipeId: recCremeBrulee.id, ingredientId: ing('Sucre'), quantity: 80, unit: 'g' },
        { recipeId: recCremeBrulee.id, ingredientId: ing('Gousse de vanille'), quantity: 1, unit: 'pièce' },
        { recipeId: recCremeBrulee.id, ingredientId: ing('Cassonade'), quantity: 40, unit: 'g' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recCremeBrulee.id, thematicId: themDessert.id } }),
  ]);

  // =========================================================
  // FILM 7 — Harry Potter à l'école des sorciers
  // =========================================================
  const workHP = await prisma.work.create({
    data: {
      title: "Harry Potter à l'école des sorciers",
      releaseYear: 2001,
      synopsis:
        "Harry découvre qu'il est un sorcier et rejoint l'école de Poudlard, où l'attendent amitiés, magie et premiers mystères.",
      image: 'https://placehold.co/400x600?text=Harry+Potter',
      categoryId: catFilm.id,
    },
  });

  const recBiereaubeurre = await prisma.recipe.create({
    data: {
      title: 'Bière au beurre des Trois Balais',
      description:
        "La boisson réconfortante servie à Pré-au-Lard. Une base crémeuse au caramel beurre salé, surmontée d'une mousse onctueuse. Sans alcool, pour petits et grands sorciers.",
      image: 'https://static.wikia.nocookie.net/harrypotter/images/b/ba/Bi%C3%A8raubeurre_Wizarding_World_of_Harry_Potter.jpg/revision/latest/scale-to-width-down/1000?cb=20150813104238&path-prefix=fr',
      prepTime: 10,
      cookTime: 10,
      servings: 4,
      difficulty: 'EASY',
      state: 'APPROVED',
      userId: gusteau.id,
      workId: workHP.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        { order: 1, content: "Faire fondre le beurre avec la cassonade et une pincée de sel jusqu'à obtenir un caramel ambré.", recipeId: recBiereaubeurre.id },
        { order: 2, content: "Ajouter 10 cl de crème liquide hors du feu, mélanger pour un caramel beurre salé lisse. Laisser tiédir.", recipeId: recBiereaubeurre.id },
        { order: 3, content: "Répartir le caramel au fond des verres, compléter avec l'eau gazeuse bien froide et l'extrait de vanille. Mélanger.", recipeId: recBiereaubeurre.id },
        { order: 4, content: "Monter le reste de crème en chantilly, en coiffer chaque verre. Servir aussitôt, la mousse mousseuse sur le dessus.", recipeId: recBiereaubeurre.id },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recBiereaubeurre.id, ingredientId: ing('Beurre'), quantity: 30, unit: 'g' },
        { recipeId: recBiereaubeurre.id, ingredientId: ing('Cassonade'), quantity: 60, unit: 'g' },
        { recipeId: recBiereaubeurre.id, ingredientId: ing('Creme liquide'), quantity: 30, unit: 'cl' },
        { recipeId: recBiereaubeurre.id, ingredientId: ing('Eau gazeuse'), quantity: 75, unit: 'cl' },
        { recipeId: recBiereaubeurre.id, ingredientId: ing('Extrait de vanille'), quantity: 1, unit: 'cc' },
        { recipeId: recBiereaubeurre.id, ingredientId: ing('Sel'), quantity: 1, unit: 'pincée' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recBiereaubeurre.id, thematicId: themBrevage.id } }),
  ]);

  // =========================================================
  // SÉRIE 3 — Stranger Things
  // =========================================================
  const workStranger = await prisma.work.create({
    data: {
      title: 'Stranger Things',
      releaseYear: 2016,
      synopsis:
        "Dans les années 80, la disparition d'un enfant à Hawkins révèle des expériences secrètes, des forces surnaturelles et une étrange petite fille aux pouvoirs psychiques.",
      image: 'https://placehold.co/400x600?text=Stranger+Things',
      categoryId: catSerie.id,
    },
  });

  const recGaufres = await prisma.recipe.create({
    data: {
      title: "Gaufres d'Eleven",
      description:
        "Les gaufres dont Eleven raffole. Croustillantes dehors, moelleuses dedans, nappées de sirop d'érable. Le réconfort ultime tout droit sorti du congélateur de Hawkins.",
      image: 'https://images.pexels.com/photos/7786846/pexels-photo-7786846.jpeg',
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      difficulty: 'EASY',
      state: 'PENDING',
      userId: julia.id,
      workId: workStranger.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        { order: 1, content: "Mélanger la farine, le sucre, la levure chimique et une pincée de sel.", recipeId: recGaufres.id },
        { order: 2, content: "Dans un autre bol, fouetter les œufs avec le lait et le beurre fondu. Verser sur les ingrédients secs, mélanger sans grumeaux.", recipeId: recGaufres.id },
        { order: 3, content: "Cuire dans un gaufrier bien chaud 3-4 min jusqu'à ce que les gaufres soient dorées et croustillantes.", recipeId: recGaufres.id },
        { order: 4, content: "Servir aussitôt, généreusement arrosées de sirop d'érable.", recipeId: recGaufres.id },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recGaufres.id, ingredientId: ing('Farine'), quantity: 250, unit: 'g' },
        { recipeId: recGaufres.id, ingredientId: ing('Lait'), quantity: 30, unit: 'cl' },
        { recipeId: recGaufres.id, ingredientId: ing('Oeuf'), quantity: 2, unit: 'pièces' },
        { recipeId: recGaufres.id, ingredientId: ing('Beurre'), quantity: 80, unit: 'g' },
        { recipeId: recGaufres.id, ingredientId: ing('Sucre'), quantity: 30, unit: 'g' },
        { recipeId: recGaufres.id, ingredientId: ing('Levure chimique'), quantity: 1, unit: 'sachet' },
        { recipeId: recGaufres.id, ingredientId: ing("Sirop d'erable"), quantity: 10, unit: 'cl' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recGaufres.id, thematicId: themDessert.id } }),
  ]);

  // =========================================================
  // SÉRIE 4 — Breaking Bad
  // =========================================================
  const workBreakingBad = await prisma.work.create({
    data: {
      title: 'Breaking Bad',
      releaseYear: 2008,
      synopsis:
        "Walter White, professeur de chimie atteint d'un cancer, bascule dans la production de méthamphétamine pour assurer l'avenir de sa famille.",
      image: 'https://placehold.co/400x600?text=Breaking+Bad',
      categoryId: catSerie.id,
    },
  });

  const recPoulet = await prisma.recipe.create({
    data: {
      title: 'Poulet frit Los Pollos Hermanos',
      description:
        "Le poulet frit de la célèbre chaîne de Gus Fring. Une panure ultra-croustillante et épicée, une chair juteuse marinée au babeurre. Recette parfaitement maîtrisée, comme tout le reste.",
      image: 'https://images.pexels.com/photos/8081264/pexels-photo-8081264.jpeg',
      prepTime: 30,
      cookTime: 20,
      servings: 4,
      difficulty: 'MEDIUM',
      state: 'APPROVED',
      userId: soma.id,
      workId: workBreakingBad.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        { order: 1, content: "Faire mariner les cuisses de poulet dans le babeurre avec l'ail écrasé, du sel et du poivre, au moins 4h (idéalement une nuit).", recipeId: recPoulet.id },
        { order: 2, content: "Mélanger la farine avec le paprika, le piment de Cayenne, du sel et du poivre. Égoutter le poulet et le rouler généreusement dans la farine épicée.", recipeId: recPoulet.id },
        { order: 3, content: "Chauffer l'huile de friture à 170°C. Plonger les morceaux et cuire 12-15 min en retournant, jusqu'à une panure dorée et croustillante.", recipeId: recPoulet.id },
        { order: 4, content: "Égoutter sur du papier absorbant, saler à chaud. Servir bien chaud.", recipeId: recPoulet.id },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recPoulet.id, ingredientId: ing('Cuisses de poulet'), quantity: 8, unit: 'pièces' },
        { recipeId: recPoulet.id, ingredientId: ing('Babeurre'), quantity: 50, unit: 'cl' },
        { recipeId: recPoulet.id, ingredientId: ing('Farine'), quantity: 250, unit: 'g' },
        { recipeId: recPoulet.id, ingredientId: ing('Paprika'), quantity: 2, unit: 'cc' },
        { recipeId: recPoulet.id, ingredientId: ing('Piment de Cayenne'), quantity: 1, unit: 'cc' },
        { recipeId: recPoulet.id, ingredientId: ing('Ail'), quantity: 3, unit: 'gousses' },
        { recipeId: recPoulet.id, ingredientId: ing('Huile de friture'), quantity: 1, unit: 'L' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recPoulet.id, thematicId: themMainDish.id } }),
  ]);

  // =========================================================
  // ANIME 3 — Le Voyage de Chihiro
  // =========================================================
  const workChihiro = await prisma.work.create({
    data: {
      title: 'Le Voyage de Chihiro',
      releaseYear: 2001,
      synopsis:
        "Chihiro, fillette de 10 ans, se retrouve piégée dans un monde d'esprits où elle doit travailler dans des bains publics pour sauver ses parents transformés en cochons.",
      image: 'https://placehold.co/400x600?text=Chihiro',
      categoryId: catAnime.id,
    },
  });

  const recOnigiri = await prisma.recipe.create({
    data: {
      title: 'Onigiri réconfortants de Haku',
      description:
        "Les boulettes de riz que Haku offre à Chihiro pour lui redonner des forces. Du riz japonais pressé à la main, garni d'umeboshi ou de saumon, enveloppé de nori.",
      image: 'https://images.pexels.com/photos/30874708/pexels-photo-30874708.jpeg',
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      difficulty: 'EASY',
      state: 'APPROVED',
      userId: soma.id,
      workId: workChihiro.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        { order: 1, content: "Cuire le riz japonais et le laisser tiédir jusqu'à ce qu'il soit manipulable mais encore légèrement chaud.", recipeId: recOnigiri.id },
        { order: 2, content: "Émietter le saumon cuit et dénoyauter les umeboshi pour préparer les garnitures.", recipeId: recOnigiri.id },
        { order: 3, content: "Mains humides et salées, prendre une poignée de riz, créer un creux, y déposer la garniture, refermer et presser en triangle.", recipeId: recOnigiri.id },
        { order: 4, content: "Entourer chaque onigiri d'une bande de nori. Servir tiède ou froid.", recipeId: recOnigiri.id },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recOnigiri.id, ingredientId: ing('Riz japonais'), quantity: 400, unit: 'g' },
        { recipeId: recOnigiri.id, ingredientId: ing('Saumon'), quantity: 150, unit: 'g' },
        { recipeId: recOnigiri.id, ingredientId: ing('Umeboshi'), quantity: 4, unit: 'pièces' },
        { recipeId: recOnigiri.id, ingredientId: ing('Feuille de nori'), quantity: 2, unit: 'feuilles' },
        { recipeId: recOnigiri.id, ingredientId: ing('Sel'), quantity: 1, unit: 'cc' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recOnigiri.id, thematicId: themAppetizer.id } }),
  ]);

  // =========================================================
  // ANIME 4 — One Piece
  // =========================================================
  const workOnePiece = await prisma.work.create({
    data: {
      title: 'One Piece',
      releaseYear: 1999,
      synopsis:
        "Monkey D. Luffy et son équipage de pirates sillonnent les mers à la recherche du légendaire trésor, le One Piece, pour faire de Luffy le Roi des Pirates.",
      image: 'https://placehold.co/400x600?text=One+Piece',
      categoryId: catAnime.id,
    },
  });

  const recViande = await prisma.recipe.create({
    data: {
      title: 'La Viande sur l\'os de Luffy',
      description:
        "Le mets favori de Luffy : une énorme pièce de viande rôtie à déguster à pleines dents, glacée au miel et caramélisée. Le carburant du futur Roi des Pirates.",
      image: 'https://images.pexels.com/photos/36829362/pexels-photo-36829362.jpeg',
      prepTime: 20,
      cookTime: 90,
      servings: 4,
      difficulty: 'MEDIUM',
      state: 'PENDING',
      userId: gusteau.id,
      workId: workOnePiece.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        { order: 1, content: "Sortir la côte de bœuf 1h à l'avance. Frotter avec l'ail, le thym, le sel et le poivre.", recipeId: recViande.id },
        { order: 2, content: "Saisir la pièce sur toutes les faces dans le beurre chaud pour former une belle croûte.", recipeId: recViande.id },
        { order: 3, content: "Enfourner à 160°C, arroser régulièrement du jus de cuisson. Cuire 70-80 min selon l'épaisseur.", recipeId: recViande.id },
        { order: 4, content: "En fin de cuisson, badigeonner de miel et passer 5 min sous le gril pour caraméliser. Laisser reposer 10 min avant de servir.", recipeId: recViande.id },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recViande.id, ingredientId: ing('Cote de boeuf'), quantity: 1500, unit: 'g' },
        { recipeId: recViande.id, ingredientId: ing('Beurre'), quantity: 50, unit: 'g' },
        { recipeId: recViande.id, ingredientId: ing('Ail'), quantity: 4, unit: 'gousses' },
        { recipeId: recViande.id, ingredientId: ing('Thym'), quantity: 3, unit: 'branches' },
        { recipeId: recViande.id, ingredientId: ing('Miel'), quantity: 3, unit: 'cs' },
        { recipeId: recViande.id, ingredientId: ing('Sel'), quantity: 2, unit: 'cc' },
        { recipeId: recViande.id, ingredientId: ing('Poivre noir'), quantity: 1, unit: 'cc' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recViande.id, thematicId: themMainDish.id } }),
  ]);

  // =========================================================
  // DESSIN ANIMÉ 2 — La Princesse et la Grenouille
  // =========================================================
  const workTiana = await prisma.work.create({
    data: {
      title: 'La Princesse et la Grenouille',
      releaseYear: 2009,
      synopsis:
        "À La Nouvelle-Orléans, Tiana rêve d'ouvrir son propre restaurant. Sa rencontre avec un prince transformé en grenouille va bouleverser ses plans.",
      image: 'https://placehold.co/400x600?text=Tiana',
      categoryId: catDessinAnime.id,
    },
  });

  const recBeignets = await prisma.recipe.create({
    data: {
      title: 'Beignets de Tiana',
      description:
        "Les beignets dorés et gonflés de Tiana, saupoudrés de sucre glace. Une douceur typique de La Nouvelle-Orléans, aussi légère qu'un rêve qui prend forme.",
      image: 'https://images.pexels.com/photos/13988842/pexels-photo-13988842.jpeg',
      prepTime: 90,
      cookTime: 15,
      servings: 6,
      difficulty: 'MEDIUM',
      state: 'APPROVED',
      userId: admin.id,
      workId: workTiana.id,
    },
  });

  await Promise.all([
    prisma.step.createMany({
      data: [
        { order: 1, content: "Délayer la levure boulangère dans le lait tiède avec une cuillère de sucre. Laisser mousser 10 min.", recipeId: recBeignets.id },
        { order: 2, content: "Mélanger la farine, le reste de sucre et le sel. Ajouter l'œuf, le beurre fondu et le mélange levure-lait. Pétrir en pâte souple.", recipeId: recBeignets.id },
        { order: 3, content: "Couvrir et laisser pousser 1h. Abaisser la pâte et découper des carrés de 5 cm.", recipeId: recBeignets.id },
        { order: 4, content: "Frire dans l'huile à 180°C jusqu'à ce qu'ils gonflent et dorent. Égoutter et saupoudrer généreusement de sucre glace.", recipeId: recBeignets.id },
      ],
    }),
    prisma.recipeIngredient.createMany({
      data: [
        { recipeId: recBeignets.id, ingredientId: ing('Farine'), quantity: 300, unit: 'g' },
        { recipeId: recBeignets.id, ingredientId: ing('Lait'), quantity: 15, unit: 'cl' },
        { recipeId: recBeignets.id, ingredientId: ing('Levure boulangere'), quantity: 10, unit: 'g' },
        { recipeId: recBeignets.id, ingredientId: ing('Sucre'), quantity: 40, unit: 'g' },
        { recipeId: recBeignets.id, ingredientId: ing('Oeuf'), quantity: 1, unit: 'pièce' },
        { recipeId: recBeignets.id, ingredientId: ing('Beurre'), quantity: 40, unit: 'g' },
        { recipeId: recBeignets.id, ingredientId: ing('Huile de friture'), quantity: 1, unit: 'L' },
        { recipeId: recBeignets.id, ingredientId: ing('Sucre glace'), quantity: 50, unit: 'g' },
      ],
    }),
    prisma.recipeThematic.create({ data: { recipeId: recBeignets.id, thematicId: themDessert.id } }),
  ]);

  console.log('Seed termine : 4 categories, 4 utilisateurs, 6 thematiques, 50 ingredients, 9 oeuvres, 9 recettes.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
