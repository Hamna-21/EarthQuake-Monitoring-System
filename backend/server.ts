import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer as createHttpServer } from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import authRoutes from "./src/routes/authRoutes";
import analyticsRoutes from "./src/routes/analyticsRoutes";
import chatRoutes from "./src/routes/chatRoutes";
import earthquakeRoutes from "./src/routes/earthquakeRoutes";
import { googleCallback } from "./src/controllers/authController";

const app = express();
const PORT = 3000;
const httpServer = createHttpServer(app);

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/earthquakes", earthquakeRoutes);

// Real Google OAuth redirect callback (top-level route)
app.get("/auth/callback", googleCallback);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server: httpServer } },
      appType: "spa",
      root: path.join(process.cwd(), "frontend"),
      configLoader: "runner",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started. Running on http://localhost:${PORT}`);
  });
}

startServer();
