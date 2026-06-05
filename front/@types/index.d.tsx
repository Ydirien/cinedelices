
export interface ICategory{
  id: number,
  name: string,
  description: string,
  
}

export interface IType{
  id: number,
  name: string,
  description: string,
  
}

export interface IRecipeDetail {
  id: number;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  state: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: number;
  workId: number;
  isLiked: boolean;
  steps: {
    id: number;
    order: number;
    content: string;
    recipeId: number;
  }[];
  recipeIngredients: {
    id: number;
    quantity: number;
    unit: string;
    ingredient: {
      id: number;
      name: string;
      image: string;
    };
  }[];
  thematics: {
    recipeId: number;
    thematicId: number;
    thematic: IType;
  }[];
  work: {
    id: number;
    image: string;
    releaseYear: number;
    synopsis: string;
    title: string;
    category: ICategory;
    categoryId: number;
  };
  _count: { likes: number };
}

export interface IRecipe {
  id: number;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  state: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: number;
  workId: number;
  steps: {
    id: number;
    order: number;
    content: string;
  }[];
  ingredients: {
    ingredientId: number;
    quantity: number;
    unit: string;
  }[];
  thematics: {
    recipeId: number,
    thematic: IType,
    thematicId: number,
    }[],
    work: {
      id:number,
      image: string,
      releaseYear: number,
      synospis: string,
      title: string,
      category: ICategory,
      categoryId: number
    }

  };


