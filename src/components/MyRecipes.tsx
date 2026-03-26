import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import RecipeCard from "./RecipeCard";
import { recipeAPI } from "../services/api";
import type { Recipe } from "../types";

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      setLoading(true);
      const recipes = await recipeAPI.getSavedRecipes();
      setSavedRecipes(recipes);
    } catch (err) {
      setError((err as Error).message || "Failed to load saved recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveSuccess = () => {
    loadSavedRecipes();
  };

  if (loading) {
    return (
      <Container className="p-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid="lg" className="p-4">
      <Row className="my-2 my-md-4 text-center">
        <p className="lead" style={{ color: "var(--color-warm-brown)" }}>
          Keep all your favorite recipes in one place
        </p>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {savedRecipes.length > 0 ? (
        <Row className="g-3">
          {savedRecipes.map((recipe) => (
            <Col key={recipe.id} xs={12} sm={6} md={6} lg={4}>
              <RecipeCard
                recipe={recipe}
                onUnsaveSuccess={handleUnsaveSuccess}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center text-muted">
          <p>No saved recipes.</p>
        </div>
      )}
    </Container>
  );
}
