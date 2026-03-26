import { Form } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder,
}: SearchBarProps) {
  return (
    <Form.Group className="search-bar-container mb-4 mx-auto">
      <Form.Label htmlFor="recipe-search" className="visually-hidden">
        Search recipes
      </Form.Label>
      <div style={{ position: "relative" }}>
        <IoSearch
          className="search-bar-icon"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        />
        <Form.Control
          id="recipe-search"
          type="search"
          aria-label="Search recipes"
          placeholder={placeholder || "Search recipes..."}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-bar-input"
        />
      </div>
    </Form.Group>
  );
}
