import express from "express";
import cors from "cors";
import agent_routes from "./routes/generate.js"; // Import agent route
import llama from "./llama_service.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/agent", agent_routes(llama)); // Mount agent routes

// Start Express server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app; // Export for Jest testing
