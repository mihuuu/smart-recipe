import { Modal, Accordion } from "react-bootstrap";
import { AttributeList, TagList } from "./RecipeCard";
import type { Recipe } from "../types";

interface RecipeModalProps {
  recipe: Recipe | null;
  show: boolean;
  onHide: () => void;
  isSaved?: boolean;
  onSave?: (e: React.MouseEvent) => void;
}

export default function RecipeModal({
  recipe,
  show,
  onHide,
  // eslint-disable-next-line no-unused-vars
  isSaved: _isSaved = false,
  // eslint-disable-next-line no-unused-vars
  onSave: _onSave,
}: RecipeModalProps) {
  if (!recipe) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered aria-labelledby="recipe-modal-title">
      <Modal.Header closeButton>
        <Modal.Title
          id="recipe-modal-title"
          style={{
            color: "var(--color-warm-brown)",
            fontWeight: 600,
          }}
        >
          {recipe.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <AttributeList recipe={recipe} />
        <div className="mb-2">
          <p className="text-muted" style={{ fontSize: "1rem" }}>
            {recipe.description}
          </p>
        </div>
        <TagList tags={recipe.tags} />
        <Accordion defaultActiveKey="ingredients" className="my-3">
          {recipe.ingredients?.length > 0 && (
            <Accordion.Item eventKey="ingredients">
              <Accordion.Header>
                <strong>Ingredients</strong>
              </Accordion.Header>
              <Accordion.Body>
                <ul style={{ paddingLeft: "1.5rem", marginBottom: 0 }}>
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} style={{ marginBottom: "0.5rem" }}>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}

          {recipe.instructions?.length > 0 && (
            <Accordion.Item eventKey="instructions">
              <Accordion.Header>
                <strong>Instructions</strong>
              </Accordion.Header>
              <Accordion.Body>
                <ol style={{ paddingLeft: "1.5rem", marginBottom: 0 }}>
                  {recipe.instructions.map((instruction, idx) => (
                    <li key={idx} style={{ marginBottom: "0.75rem" }}>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </Accordion.Body>
            </Accordion.Item>
          )}

          {recipe.tips && recipe.tips.length > 0 && (
            <Accordion.Item eventKey="tips">
              <Accordion.Header>
                <strong>Cooking Tips</strong>
              </Accordion.Header>
              <Accordion.Body>
                <ul style={{ paddingLeft: "1.5rem", marginBottom: 0 }}>
                  {recipe.tips.map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: "0.5rem" }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </Modal.Body>
    </Modal>
  );
}
