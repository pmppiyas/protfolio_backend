import compression from "compression";
import cors from "cors";
import express, { type Application, type Request, type Response, type NextFunction } from "express";
import router from "./routes/index.js";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.get("/", (_req, res) => {
  res.send("Portfolio API is running...");
});

app.use("/api/v1", router);

// 404 Handler
app.use((_req, res, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API Route not found",
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(">>> Global Error Handler Caught:", err);
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

export default app;
