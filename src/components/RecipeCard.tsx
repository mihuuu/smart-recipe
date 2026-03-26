import { useState } from "react";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { HiMiniChartBar } from "react-icons/hi2";
import { IoTime } from "react-icons/io5";
import { FaFire } from "react-icons/fa";
import RecipeModal from "./RecipeModal";
import { useToast } from "../hooks/useToast";
import { recipeAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Recipe } from "../types";

interface AttributeListProps {
  recipe: Recipe;
}

export function AttributeList({ recipe }: AttributeListProps) {
  return (
    <div className="d-flex gap-2 mb-3 flex-wrap">
      <span className="badge badge-difficulty">
        <HiMiniChartBar aria-hidden="true" /> {recipe.difficulty}
      </span>
      <span className="badge badge-time">
        <IoTime aria-hidden="true" /> {recipe.prepTime}
      </span>
      <span className="badge badge-calories">
        <FaFire aria-hidden="true" /> {recipe.calories} cal
      </span>
    </div>
  );
}

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="d-flex gap-2 flex-wrap">
      {tags.map((tag) => (
        <span key={tag} className="badge badge-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  onSaveSuccess?: () => void;
  onUnsaveSuccess?: () => void;
}

export default function RecipeCard({ recipe, onSaveSuccess, onUnsaveSuccess }: RecipeCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [isSaved, setIsSaved] = useState(!!recipe.isSaved);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { ToastComponent, showToast } = useToast();
  const showAction = !!isAuthenticated;

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    if (!isAuthenticated) {
      showToast("Please login to save recipes", "danger");
      return;
    }

    if (!isSaved) {
      setLoading(true);
      try {
        await recipeAPI.saveRecipe(recipe);
        setIsSaved(true);
        showToast("Recipe saved successfully!");
        onSaveSuccess?.();
      } catch (err) {
        console.error("Error saving recipe:", err);
        showToast((err as Error).message || "Failed to save recipe", "danger");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUnsave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    if (isSaved) {
      setLoading(true);
      try {
        await recipeAPI.deleteRecipe(recipe.id);
        setIsSaved(false);
        onUnsaveSuccess?.();
      } catch (err) {
        console.error("Error removing recipe:", err);
        showToast((err as Error).message || "Failed to remove recipe", "danger");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <ToastComponent />
      <Card
        className="recipe-card"
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${recipe.title}`}
      >
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title
              as="h3"
              className="h5 mb-0 me-2"
              style={{ color: "var(--color-warm-brown)", flex: 1 }}
            >
              {recipe.title}
            </Card.Title>
            {showAction && (
              <OverlayTrigger
                placement="top"
                delay={{ show: 250 }}
                overlay={
                  <Tooltip>
                    {isSaved ? "Remove from My Recipes" : "Save to My Recipes"}
                  </Tooltip>
                }
              >
                <button
                  type="button"
                  onClick={isSaved ? handleUnsave : handleSave}
                  disabled={loading}
                  aria-label={
                    isSaved ? "Remove from My Recipes" : "Save to My Recipes"
                  }
                  style={{
                    cursor: loading ? "wait" : "pointer",
                    fontSize: "28px",
                    color: "var(--color-primary)",
                    lineHeight: 0,
                    opacity: loading ? 0.6 : 1,
                    background: "none",
                    border: "none",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSaved ? <HiHeart /> : <HiOutlineHeart />}
                </button>
              </OverlayTrigger>
            )}
          </div>
          <AttributeList recipe={recipe} />
          <Card.Text
            className="text-muted mb-3"
            style={{ minHeight: "40px", fontSize: "0.9rem" }}
          >
            {recipe.description}
          </Card.Text>
          <TagList tags={recipe.tags} />
        </Card.Body>
      </Card>
      <RecipeModal
        recipe={recipe}
        show={showModal}
        onHide={handleCloseModal}
        isSaved={isSaved}
        onSave={handleSave}
      />
    </>
  );
}
