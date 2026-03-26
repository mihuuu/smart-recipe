import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import RecipeCard from "./RecipeCard";
import SearchBar from "./SearchBar";
import { recipeAPI } from "../services/api";
import { useDebounce } from "use-debounce";
import type { Recipe } from "../types";

export default function Explore() {
  const [publicRecipes, setPublicRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 250);

  useEffect(() => {
    loadPublicRecipes();
  }, []);

  const loadPublicRecipes = async () => {
    try {
      setLoading(true);
      const recipes = await recipeAPI.getPublicRecipes();
      setPublicRecipes(recipes);
    } catch (err) {
      setError((err as Error).message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = publicRecipes.filter((recipe) => {
    if (!debouncedQuery?.trim()) return true;

    const query = debouncedQuery.trim().toLowerCase();
    const matchesTitle = recipe.title.toLowerCase().includes(query);
    const matchesDescription = recipe.description.toLowerCase().includes(query);
    const matchesTags = recipe.tags.some((tag) =>
      tag.toLowerCase().includes(query)
    );
    return matchesTitle || matchesDescription || matchesTags;
  });

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
          Discover recipes saved by our community
        </p>
      </Row>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by title, description, or tags..."
      />

      {error && (
        <Alert variant="danger" className="mb-3 w-50 mx-auto">
          {error}
        </Alert>
      )}

      {publicRecipes.length > 0 ? (
        filteredRecipes.length > 0 ? (
          <Row className="g-3">
            {filteredRecipes.map((recipe) => (
              <Col key={recipe.id} xs={12} sm={6} md={6} lg={4}>
                <RecipeCard recipe={recipe} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center text-muted">
            <p>No recipes found matching "{debouncedQuery}"</p>
          </div>
        )
      ) : (
        <div className="text-center text-muted">
          <p>No recipes to explore yet.</p>
          <p>Be the first to save a recipe!</p>
        </div>
      )}
    </Container>
  );
}
