import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import recipeRoutes from "./routes/recipes";
import preferencesRoutes from "./routes/preferences";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:5173", "https://cs571-f25.github.io"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.get("/", (_req, res) => {
  res.json({
    message: "Recipe Generator API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      recipes: "/api/recipes",
      preferences: "/api/preferences",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/preferences", preferencesRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
