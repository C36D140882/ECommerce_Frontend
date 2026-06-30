// Category data exports
import groceryEssentials from './groceryEssentials.json';
import fruitsVegetables from './fruitsVegetables.json';
import personalCareHomeCare from './personalCarehomeCare.json';
import dairyBeverages from './dairyBeverages.json';
import snacksPackagedFoods from './snacksPackagedFoods.json';

export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  unit: string;
  stock: number;
  rating: number;
  ratingCount: number;
  imageUrl: string;
}

export interface Category {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  description: string;
  products: Product[];
}

export const allCategories: Category[] = [
  groceryEssentials as Category,
  fruitsVegetables as Category,
  personalCareHomeCare as Category,
  dairyBeverages as Category,
  snacksPackagedFoods as Category,
];

export const getCategoryById = (id: string): Category | undefined =>
  allCategories.find((c) => c.categoryId === id);

export {
  groceryEssentials,
  fruitsVegetables,
  personalCareHomeCare,
  dairyBeverages,
  snacksPackagedFoods,
};
