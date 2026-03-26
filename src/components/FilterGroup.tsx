import { Form, Row, Col } from "react-bootstrap";

interface FilterGroupProps {
  category: string;
  label: string;
  icon?: string;
  options: string[];
  selectedValues?: string[];
  onChange: (category: string, value: string) => void;
}

export default function FilterGroup({
  category,
  label,
  icon,
  options,
  selectedValues = [],
  onChange,
}: FilterGroupProps) {
  return (
    <Form.Group className="mb-4 mb-md-5">
      <Form.Label className="h5 mb-3" style={{ color: "var(--color-primary)" }}>
        {icon && <span className="me-2">{icon}</span>}
        {label}
      </Form.Label>
      <Row className="filter-group g-2 align-items-center">
        {options.map((option) => (
          <Col key={option} xs={6} sm={6} md={4} lg={3} xl={2}>
            <Form.Check
              type="checkbox"
              id={`${category}-${option}`}
              label={option}
              checked={selectedValues.includes(option)}
              onChange={() => onChange(category, option)}
              className="preference-checkbox"
            />
          </Col>
        ))}
      </Row>
    </Form.Group>
  );
}
