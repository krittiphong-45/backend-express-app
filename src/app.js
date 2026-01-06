import express from "express";
import cors from "cors";
import { router as apiRoutes } from "./routes/index.js";
import cookParser from "cookie-parser";
import helmet from "helmet";
import { limiter } from "./middlewares/rateLimter.js";


export const app = express();
// setting Middlewares

app.set("trust proxy", 1);

// Global middlewares
app.use(helmet());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://frontend-react-app-chi.vercel.app"
  ],
  credentials: true, // ✅ allow cookies to be sent
};

app.use(cors(corsOptions));

app.use(limiter);

app.use(express.json());

// Middleware to parse cookies (required cookie-based authentication)
app.use(cookParser());

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.use("/api", apiRoutes);

// catch-all for 404 Not Found
app.use((req, res, next) => {
  const error = new Error(`Not foud: ${req.method} ${req.originalUrl}`)
  error.name = "NotFoundError"
  error.status = 404
  next(error)
})

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    succes: false,
    message: err.message || "Internal Server Error",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: err.stack,
  });
})