import type { Recipe } from '../types';

const STORAGE_KEY = 'savedRecipes';

export const getSavedRecipes = (): Recipe[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Recipe[]) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveRecipe = (recipe: Recipe): boolean => {
  try {
    const saved = getSavedRecipes();
    const exists = saved.some((r) => r.id === recipe.id);
    if (!exists) {
      saved.push(recipe);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const removeRecipe = (recipeId: string): boolean => {
  try {
    const saved = getSavedRecipes();
    const filtered = saved.filter((r) => r.id !== recipeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

export const isRecipeSaved = (recipeId: string): boolean => {
  const saved = getSavedRecipes();
  return saved.some((r) => r.id === recipeId);
};
