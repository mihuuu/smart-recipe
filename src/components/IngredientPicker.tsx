import { useMemo, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { allIngredients } from "../utils/ingredientsList";

interface IngredientPickerProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled: boolean;
}

export default function IngredientPicker({ selected, onChange, disabled }: IngredientPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? allIngredients.filter((i) => i.includes(q)) : allIngredients;
  }, [search]);

  const isCustom =
    search.trim().length > 0 &&
    !allIngredients.includes(search.trim().toLowerCase());

  const toggle = (item: string) => {
    onChange(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item]
    );
    setSearch("");
  };

  const addCustom = () => {
    const val = search.trim();
    if (val && !selected.includes(val)) onChange([...selected, val]);
    setSearch("");
  };

  return (
    <div>
      {selected.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          {selected.map((item) => (
            <span key={item} className="badge-ingredient d-inline-flex align-items-center gap-1">
              {item}
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ fontSize: "0.5rem" }}
                onClick={() => toggle(item)}
                disabled={disabled}
                aria-label={`Remove ${item}`}
              />
            </span>
          ))}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                isCustom ? addCustom() : filtered.length > 0 && toggle(filtered[0]);
              }
            }}
            onBlur={() => setSearch("")}
            disabled={disabled}
            aria-label="Search ingredients"
          />
        </InputGroup>

        {search.trim().length > 0 && (
          <div className="ingredient-picker-list" onMouseDown={(e) => e.preventDefault()}>
            {filtered.map((item) => (
              <Form.Check
                key={item}
                type="checkbox"
                id={`ing-${item}`}
                label={item}
                checked={selected.includes(item)}
                onChange={() => toggle(item)}
                disabled={disabled}
                className="preference-checkbox"
              />
            ))}
            {filtered.length === 0 && isCustom && (
              <small className="text-muted" style={{ textTransform: "none" }}>
                No matches — press Enter to add a custom ingredient.
              </small>
            )}
          </div>
        )}
      </div> 
    </div>
  );
}
