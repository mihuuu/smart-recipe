import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import IngredientForm from "./IngredientForm";
import SuggestedRecipes from "./SuggestedRecipes";
import { useAuth } from "../context/AuthContext";
import type { Recipe } from "../types";

type Step = "ingredients" | "recipes";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>("ingredients");
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient");
      return;
    }

    if (!isAuthenticated) {
      setError("Please log in to generate recipes");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { recipeAPI } = await import("../services/api");
      const generatedRecipes = await recipeAPI.generateRecipes(ingredients);

      setRecipes(generatedRecipes);
      setCurrentStep("recipes");
    } catch (err) {
      console.error("Error generating recipes:", err);
      setError((err as Error).message || "Failed to generate recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToIngredients = () => {
    setCurrentStep("ingredients");
    setRecipes([]);
    setIngredients("");
  };

  return (
    <Container className="p-4">
      <Row className="my-4 text-center">
        <p
          className="lead"
          style={{ color: "var(--color-warm-brown)", fontSize: "1.25rem" }}
        >
          Turn your ingredients into delicious recipes ✨
        </p>
      </Row>

      {currentStep === "ingredients" ? (
        <IngredientForm
          ingredients={ingredients}
          setIngredients={setIngredients}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      ) : (
        <SuggestedRecipes recipes={recipes} onBack={handleBackToIngredients} />
      )}
    </Container>
  );
}
