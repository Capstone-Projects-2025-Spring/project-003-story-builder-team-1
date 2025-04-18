import express from "express";
import agent_routes from "./routes/generate.js"; // Import agent route
import deepseek from "./deepseek_service.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/agent", agent_routes(deepseek)); // Mount agent routes

// Start Express server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app; // Export for Jest testing
