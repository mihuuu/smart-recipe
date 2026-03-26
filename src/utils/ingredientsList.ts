export const allIngredients: string[] = [
  // Vegetables
  "avocado", "bell pepper", "broccoli", "cabbage", "carrot", "celery",
  "corn", "cucumber", "garlic", "mushroom", "onion", "peas", "potato",
  "spinach", "tomato", "zucchini",
  // Proteins
  "bacon", "beef", "chicken", "chickpeas", "eggs", "lamb", "lentils",
  "pork", "salmon", "sausage", "shrimp", "tofu", "tuna", "turkey",
  // Dairy
  "butter", "cheddar", "cheese", "cream", "cream cheese", "milk",
  "mozzarella", "parmesan", "sour cream", "yogurt",
  // Grains
  "bread", "couscous", "flour", "noodles", "oats", "pasta", "quinoa",
  "rice", "tortilla",
  // Fruits
  "apple", "avocado", "banana", "berries", "lemon", "lime", "mango",
  "orange", "pineapple",
  // Spices & Pantry
  "basil", "chili flakes", "cinnamon", "cumin", "garlic powder", "ginger",
  "honey", "olive oil", "oregano", "paprika", "pepper", "salt",
  "soy sauce", "turmeric", "vinegar",
].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a.localeCompare(b));
