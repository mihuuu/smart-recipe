import express from "express";
import {
  generateRecipes,
  saveRecipe,
  getSavedRecipes,
  getRecipe,
  deleteRecipe,
  getPublicRecipes,
} from "../controllers/recipeController";
import { protect, optionalAuth } from "../middleware/auth";

const router = express.Router();

router.get("/public/all", optionalAuth, getPublicRecipes);

router.use(protect);

router.post("/generate", generateRecipes);
router.post("/save", saveRecipe);
router.get("/saved", getSavedRecipes);
router.get("/:id", getRecipe);
router.delete("/:id", deleteRecipe);

export default router;
