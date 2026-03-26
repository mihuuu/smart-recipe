import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import About from "./components/About";
import Explore from "./components/Explore";
import Saved from "./components/MyRecipes";
import Preference from "./components/Preference";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useAuth } from "./context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <Navigation />
        <div className="app-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Saved />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <Preference />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
