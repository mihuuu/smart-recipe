import { Container, Row, Col, Card } from "react-bootstrap";

export default function About() {
  const features = [
    {
      title: "Recipe Generation",
      description: "AI-powered recipe suggestions based on your ingredients",
    },
    {
      title: "Recipe Details",
      description:
        "View ingredient lists, step-by-step instructions, and cooking tips",
    },
    {
      title: "Save Recipes",
      description:
        'Users can save or remove favorite recipes to their personal "My Recipes" page',
    },
    {
      title: "Preference Settings",
      description:
        "Filter by cooking complexity, cuisine style, dietary restrictions, and more",
    },
    {
      title: "Community Recipes",
      description:
        "Browse and search through recipes saved by other users in the community",
    },
  ];

  const techStack = [
    {
      title: "React & React Router",
      description: "Frontend development and navigation",
    },
    {
      title: "React Bootstrap",
      description: "Responsive and consistent UI",
    },
    {
      title: "Vite",
      description: "Fast development and building",
    },
    {
      title: "Node.js & Express",
      description: "RESTful API for backend",
    },
    {
      title: "MongoDB",
      description: "Data persistence for users and recipes",
    },
    {
      title: "OpenAI API",
      description: "AI-powered recipe generation",
    },
  ];

  const listItemStyle = { lineHeight: "1.7" };
  const textStyle = { color: "var(--color-warm-brown)" };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={10} className="mx-auto">
          <div className="text-center mb-5">
            <h1 className="hero-title display-3 mb-3">About SmartRecipe</h1>
            <p className="lead" style={{ color: "var(--color-warm-brown)" }}>
              Your AI-powered cooking companion
            </p>
          </div>

          <Card className="mb-5">
            <Card.Body className="p-5">
              <Card.Title
                as="h2"
                className="h4 mb-4"
                style={{ color: "var(--color-primary)" }}
              >
                What is SmartRecipe?
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "var(--color-warm-brown)",
                }}
              >
                SmartRecipe is an AI-powered web application that helps users
                decide what to cook using the available ingredients. By entering
                a few ingredients, users can instantly generate personalized
                recipes, view nutritional details, and explore different cooking
                styles and dietary preferences.
              </Card.Text>
              <Card.Text
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "var(--color-warm-brown)",
                }}
              >
                For example, if a user inputs "tomato," "beef," and "potato", AI
                may suggest recipes such as Beef Stew with Tomatoes or Spiced
                Beef and Potato Hash. The goal is to make cooking more
                accessible, creative, and efficient, especially for students and
                busy professionals who often wonder "What should I cook today?"
              </Card.Text>
            </Card.Body>
          </Card>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="p-4">
                  <Card.Title
                    as="h3"
                    className="h5 mb-4"
                    style={{ color: "var(--color-primary)" }}
                  >
                    ✨ Features
                  </Card.Title>
                  <ul className="mb-0" style={{ paddingLeft: "1.25rem" }}>
                    {features.map((feature, index) => (
                      <li
                        key={index}
                        className={index < features.length - 1 ? "mb-3" : ""}
                        style={listItemStyle}
                      >
                        <strong style={textStyle}>{feature.title}: </strong>
                        <span style={textStyle}>{feature.description}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body className="p-4">
                  <Card.Title
                    as="h3"
                    className="h5 mb-4"
                    style={{ color: "var(--color-primary)" }}
                  >
                    🛠️ Tech Stack
                  </Card.Title>
                  <ul className="mb-0" style={{ paddingLeft: "1.25rem" }}>
                    {techStack.map((tech, index) => (
                      <li
                        key={index}
                        className={index < techStack.length - 1 ? "mb-3" : ""}
                        style={listItemStyle}
                      >
                        <strong style={textStyle}>{tech.title}: </strong>
                        <span style={textStyle}>{tech.description}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-4 mb-4">
            <div
              className="mb-2"
              style={{ color: "var(--color-warm-brown)", fontSize: "1rem" }}
            >
              Made with 🧡 by Handan Hu
            </div>
            <a
              href="https://github.com/mihuuu/smart-recipe"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--color-primary)",
                textDecoration: "none",
                marginLeft: "5px",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.textDecoration = "none")
              }
            >
              GitHub
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
