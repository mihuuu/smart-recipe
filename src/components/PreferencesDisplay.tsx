import { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import { Link } from "react-router";
import { preferenceCategories } from "../utils/preferences";
import { HiOutlineExternalLink as EditIcon } from "react-icons/hi";
import { preferencesAPI } from "../services/api";
import type { Preferences } from "../types";

export default function PreferencesDisplay() {
  const [preferences, setPreferences] = useState<Partial<Preferences>>({});

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const prefs = await preferencesAPI.getPreferences();
    setPreferences(prefs);
  };

  const hasPreferences = Object.values(preferences || {}).some(
    (arr) => arr.length > 0
  );

  return (
    <Accordion className="mb-3 accordion-preferences">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className="d-flex align-items-center w-100">
            <span
              style={{
                color: "var(--color-warm-brown)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Recipe Preferences
            </span>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          {hasPreferences ? (
            <>
              {preferenceCategories.map((category) => {
                const selectedOptions = preferences[category.key];
                if (!selectedOptions?.length) return null;
                return (
                  <div
                    key={category.key}
                    className="mb-2"
                    style={{
                      color: "var(--color-warm-brown)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span className="me-2">{category.label}:</span>
                    {selectedOptions.map((option) => (
                      <span key={option} className="badge badge-tag me-1">
                        {option}
                      </span>
                    ))}
                  </div>
                );
              })}
            </>
          ) : (
            <div
              style={{
                color: "var(--color-warm-brown-light)",
                fontSize: "0.9rem",
              }}
            >
              No preferences set yet.
              <br />
              Customize your preferences for personalized recipes.
            </div>
          )}
          <div className="mt-2">
            <Link
              to="/preferences"
              className="text-decoration-none d-flex align-items-center justify-content-end gap-1"
              style={{
                color: "var(--color-primary)",
                fontWeight: 600,
              }}
            >
              <EditIcon style={{ fontSize: "1.15rem" }} />{" "}
              <span style={{ fontSize: "0.9rem" }}>Edit</span>
            </Link>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
