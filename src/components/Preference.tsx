import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  getUserPreferences,
  saveUserPreferences,
  preferenceCategories,
} from "../utils/preferences";
import { preferencesAPI } from "../services/api";
import FilterGroup from "./FilterGroup";
import { useToast } from "../hooks/useToast";
import type { Preferences } from "../types";

const DEFAULT_PREFERENCES: Preferences = {
  complexity: [],
  spice: [],
  dietary: [],
  cuisine: [],
  meal: [],
};

export default function Preference() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const { ToastComponent, showToast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const apiPrefs = await preferencesAPI.getPreferences();
      setPreferences(apiPrefs);
      saveUserPreferences(apiPrefs);
    } catch (err) {
      console.error("Error loading preferences:", err);
      const localPrefs = getUserPreferences();
      setPreferences(localPrefs);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setPreferences((prev) => {
      const currentArray = prev[category] || [];
      const isSelected = currentArray.includes(value);

      return {
        ...prev,
        [category]: isSelected
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleSave = async () => {
    try {
      await preferencesAPI.updatePreferences(preferences);
      saveUserPreferences(preferences);
      showToast("Preferences saved successfully!");
    } catch (err) {
      console.error("Error saving preferences:", err);
      showToast("Error saving preferences. Please try again.", "warning");
    }
  };

  const handleReset = async () => {
    try {
      const defaultPrefs = await preferencesAPI.resetPreferences();
      setPreferences(defaultPrefs);
      saveUserPreferences(defaultPrefs);
      showToast("Preferences reset successfully!");
    } catch (err) {
      console.error("Error resetting preferences:", err);
      showToast("Error resetting preferences. Please try again.", "warning");
    }
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
    <Container className="p-4 w-responsive-75">
      <ToastComponent />
      <Row className="my-2 my-md-4 text-center">
        <p className="lead" style={{ color: "var(--color-warm-brown)" }}>
          Customize your recipe recommendations 🪄
        </p>
      </Row>

      <Card className="mb-4 mx-auto">
        <Card.Body className="p-4 p-md-5">
          <Form>
            {preferenceCategories.map((category) => (
              <FilterGroup
                key={category.key}
                category={category.key}
                label={category.label}
                icon={category.icon}
                options={category.options}
                selectedValues={preferences[category.key] || []}
                onChange={handleCheckboxChange}
              />
            ))}
          </Form>

          <div className="d-flex gap-3 justify-content-end mt-4">
            <Button variant="outline-secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Preferences
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
