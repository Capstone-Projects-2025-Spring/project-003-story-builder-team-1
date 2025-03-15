import express from "express";
import cors from "cors";
import agent_routes from "./agent.js"; // Import agent route

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", agent_routes); // Mount agent routes

// Start Express server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app; // Export for Jest testing
