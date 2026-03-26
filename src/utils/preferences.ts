import type { Preferences, PreferenceCategory } from '../types';

const STORAGE_KEY = "userPreferences";

const DEFAULT_PREFERENCES: Preferences = {
  complexity: [],
  spice: [],
  dietary: [],
  cuisine: [],
  meal: [],
};

export const preferenceCategories: PreferenceCategory[] = [
  {
    key: "complexity",
    label: "Cooking Complexity",
    icon: "⏱️",
    options: ["Easy", "Medium", "Hard"],
  },
  {
    key: "spice",
    label: "Spice Level",
    icon: "🌶️",
    options: ["Mild", "Medium", "Hot"],
  },
  {
    key: "dietary",
    label: "Dietary Restrictions",
    icon: "🥗",
    options: [
      "Vegan",
      "Vegetarian",
      "Gluten-Free",
      "Dairy-Free",
      "Nut-Free",
      "Keto",
      "Paleo",
      "Low-Carb",
    ],
  },
  {
    key: "cuisine",
    label: "Cuisine Style",
    icon: "🌍",
    options: [
      "Asian",
      "American",
      "Mexican",
      "Mediterranean",
      "Italian",
      "French",
      "Middle Eastern",
      "Chinese",
      "Japanese",
      "Indian",
      "Thai",
    ],
  },
  {
    key: "meal",
    label: "Meal Type",
    icon: "🍽️",
    options: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
  },
];

export const getUserPreferences = (): Preferences => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Preferences) : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error("Error reading preferences from localStorage:", error);
    return DEFAULT_PREFERENCES;
  }
};

export const saveUserPreferences = (preferences: Preferences): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("Error saving preferences to localStorage:", error);
    return false;
  }
};

export const resetPreferences = (): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    return true;
  } catch (error) {
    console.error("Error resetting preferences:", error);
    return false;
  }
};
