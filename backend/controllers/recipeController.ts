import { Request, Response } from "express";
import Recipe from "../models/Recipe";
import UserRecipe from "../models/UserRecipe";
import User from "../models/User";
import { generateRecipes as generateRecipesAI } from "../services/openaiService";
import type { IRecipe } from "../models/Recipe";

export const generateRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ingredients } = req.body as { ingredients: string };

    if (!ingredients || typeof ingredients !== "string" || !ingredients.trim()) {
      res.status(400).json({
        success: false,
        message: "Please provide ingredients",
      });
      return;
    }

    const user = await User.findById(req.user!.id).select("preferences");
    const preferences = user?.preferences || {};

    const recipes = await generateRecipesAI(ingredients, preferences);

    res.json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    console.error("Generate recipes error:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to generate recipes",
    });
  }
};

export const saveRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipeData = req.body as Partial<IRecipe>;

    let recipe = await Recipe.findOne({ title: recipeData.title });

    if (!recipe) {
      recipe = await Recipe.create({
        ...recipeData,
        createdBy: req.user!.id,
      });
    }

    const existingUserRecipe = await UserRecipe.findOne({
      userId: req.user!.id,
      recipeId: recipe._id,
    });

    if (existingUserRecipe) {
      res.json({
        success: true,
        data: recipe,
        message: "Recipe already saved",
      });
      return;
    }

    await UserRecipe.create({
      userId: req.user!.id,
      recipeId: recipe._id,
    });

    res.status(201).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getSavedRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRecipes = await UserRecipe.find({ userId: req.user!.id })
      .populate("recipeId")
      .sort({ savedAt: -1 });

    const recipes = userRecipes
      .map((ur) => ur.recipeId as IRecipe | null)
      .filter((recipe): recipe is IRecipe => recipe !== null)
      .map((recipe) => ({
        ...recipe.toJSON(),
        isSaved: true,
      }));

    res.json({
      success: true,
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRecipe = await UserRecipe.findOne({
      userId: req.user!.id,
      recipeId: req.params.id,
    });

    if (!userRecipe) {
      res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
      return;
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
      return;
    }

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await UserRecipe.deleteOne({
      userId: req.user!.id,
      recipeId: req.params.id,
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
      return;
    }

    res.json({
      success: true,
      data: {},
      message: "Recipe removed from My Recipes",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getPublicRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });

    let userSavedRecipeIds: string[] = [];
    if (req.user) {
      const userRecipes = await UserRecipe.find({
        userId: req.user.id,
      }).select("recipeId");
      userSavedRecipeIds = userRecipes.map((ur) =>
        (ur.recipeId as mongoose.Types.ObjectId).toString()
      );
    }

    const recipesWithSavedStatus = recipes.map((recipe) => ({
      ...recipe.toJSON(),
      isSaved: userSavedRecipeIds.includes(recipe._id.toString()),
    }));

    res.json({
      success: true,
      data: recipesWithSavedStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

import mongoose from "mongoose";
