import request from "supertest";
import app from "../agent_server.js"; // Import the app for testing

describe("Agent Server API", () => {
    it("should respond with a 404 for an unknown route", async () => {
        const response = await request(app).get("/unknown-route");
        expect(response.status).toBe(404);
    });
});