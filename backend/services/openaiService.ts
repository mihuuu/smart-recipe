import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { randomUUID } from "crypto";
import type { IUserPreferences } from "../models/User";

let openaiClient: OpenAI | undefined;

function getClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY");
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  calories: z.string(),
  tags: z.array(z.string()),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tips: z.array(z.string()),
});

const RecipesResponseSchema = z.object({
  recipes: z.array(RecipeSchema).length(3),
});

type RecipeOutput = z.infer<typeof RecipeSchema> & {
  id: string;
  generatedFrom: string[];
};

export const generateRecipes = async (
  ingredients: string,
  preferences: Partial<IUserPreferences> = {}
): Promise<RecipeOutput[]> => {
  try {
    const client = getClient();
    const prompt = buildPrompt(ingredients, preferences);

    const response = await (client as any).responses.parse({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            "You are a professional chef and recipe creator. Generate detailed, practical recipes based on the ingredients provided. Return exactly 3 recipe objects. Each recipe must have: title, description, prepTime (e.g. '30 min'), difficulty ('Easy', 'Medium', or 'Hard'), calories (e.g. '350'), tags (array), ingredients (array with quantities), instructions (array, step by step), and tips (array).",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      reasoning: { effort: "minimal" },
      max_output_tokens: 3000,
      text: {
        format: zodTextFormat(RecipesResponseSchema, "recipes"),
      },
    });

    const parsedResponse = response.output_parsed as z.infer<typeof RecipesResponseSchema>;

    const recipes: RecipeOutput[] = parsedResponse.recipes.map((recipe) => ({
      ...recipe,
      id: randomUUID(),
      generatedFrom: ingredients.split(",").map((i) => i.trim()),
    }));

    return recipes;
  } catch (error) {
    console.error("OpenAI API Error:", error);

    const err = error as { code?: string; status?: number };
    if (err.code === "insufficient_quota" || err.status === 429) {
      console.log("Using fallback recipes due to API quota");
      return getFallbackRecipes(ingredients);
    }

    throw new Error(`Failed to generate recipes: ${(error as Error).message}`);
  }
};

const buildPrompt = (
  ingredients: string,
  preferences: Partial<IUserPreferences>
): string => {
  let prompt = `Generate 3 unique and delicious recipes using these ingredients: ${ingredients}.\n\n`;

  if (preferences.complexity?.length) {
    prompt += `Preferred cooking complexity: ${preferences.complexity.join(", ")}.\n`;
  }

  if (preferences.spice?.length) {
    prompt += `Preferred spice level: ${preferences.spice.join(", ")}.\n`;
  }

  if (preferences.dietary?.length) {
    prompt += `Dietary restrictions: ${preferences.dietary.join(", ")}.\n`;
  }

  if (preferences.cuisine?.length) {
    prompt += `Preferred cuisine styles: ${preferences.cuisine.join(", ")}.\n`;
  }

  if (preferences.meal?.length) {
    prompt += `Meal type: ${preferences.meal.join(", ")}.\n`;
  }

  prompt += `\nReturn ONLY a valid JSON object with a "recipes" property containing an array of exactly 3 recipe objects. Each recipe must include all required fields.`;

  return prompt;
};

const getFallbackRecipes = (ingredients: string): RecipeOutput[] => {
  const ingredientList = ingredients.split(",").map((i) => i.trim());

  return [
    {
      id: randomUUID(),
      title: `Simple ${ingredientList[0] || "Ingredient"} Dish`,
      description:
        "A quick and easy recipe using your ingredients. This is a fallback recipe while we're experiencing API issues.",
      prepTime: "25 min",
      difficulty: "Easy",
      calories: "350",
      tags: ["Simple", "Quick"],
      ingredients: ingredientList.map((ing) => `1 portion ${ing}`),
      instructions: [
        "Prepare all ingredients by washing and cutting as needed.",
        "Heat a pan with oil over medium heat.",
        "Add your main ingredients and cook until done.",
        "Season to taste and serve hot.",
      ],
      tips: [
        "Adjust cooking time based on your ingredients.",
        "Season generously for best flavor.",
      ],
      generatedFrom: ingredientList,
    },
    {
      id: randomUUID(),
      title: `Roasted ${ingredientList[0] || "Ingredient"} Medley`,
      description:
        "A flavorful roasted dish that's simple to prepare. This is a fallback recipe while we're experiencing API issues.",
      prepTime: "35 min",
      difficulty: "Easy",
      calories: "320",
      tags: ["Roasted", "Healthy"],
      ingredients: ingredientList.map((ing) => `1 portion ${ing}`),
      instructions: [
        "Preheat oven to 400°F (200°C).",
        "Chop ingredients into even pieces.",
        "Toss with olive oil, salt, and pepper.",
        "Roast for 25-30 minutes until golden.",
      ],
      tips: [
        "Cut ingredients into similar sizes for even cooking.",
        "Don't overcrowd the pan.",
      ],
      generatedFrom: ingredientList,
    },
    {
      id: randomUUID(),
      title: `${ingredientList[0] || "Ingredient"} Stir-Fry`,
      description:
        "A versatile stir-fry that works with many ingredients. This is a fallback recipe while we're experiencing API issues.",
      prepTime: "20 min",
      difficulty: "Easy",
      calories: "380",
      tags: ["Stir-Fry", "Quick"],
      ingredients: ingredientList.map((ing) => `1 portion ${ing}`),
      instructions: [
        "Heat wok or large pan over high heat.",
        "Add oil and wait until it shimmers.",
        "Add ingredients in order of cooking time (longest first).",
        "Stir constantly and season well.",
      ],
      tips: [
        "Keep ingredients moving to prevent burning.",
        "Have everything prepped before you start cooking.",
      ],
      generatedFrom: ingredientList,
    },
  ];
};
