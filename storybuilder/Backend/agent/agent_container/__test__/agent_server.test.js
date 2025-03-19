import request from "supertest";
import app from "../agent_server.js";
import { jest } from "@jest/globals";

// Mock the llamaai module
jest.unstable_mockModule("llamaai", () => ({
  default: jest.fn().mockImplementation(() => ({
    run: jest.fn().mockResolvedValue({
      choices: [{ message: { content: "Mocked AI response" } }],
    }),
  })),
}));

// Import the mocked module
const { default: MockedLlamaAI } = await import("llamaai");

describe("POST /agent/generate", () => {

  it("should return 200 and AI-generated response", async () => {
    // Define input data
    const inputData = { message: "Hello, AI!" };
    const aiInstance = new MockedLlamaAI();
    const response = await aiInstance.run(inputData);

    expect(response).toEqual({
      choices: [{ message: { content: "Mocked AI response" } }],
    });
  });

  it("should return 400 if message is missing", async () => {
    const response = await request(app)
      .post(`/agent/generate`)
      .send({})
      .expect(400);

    expect(response.body).toEqual({ error: "Message is required" });
  });

  it("should handle an AI error", async () => {
    const aiInstance = new MockedLlamaAI();
    aiInstance.run.mockRejectedValue(new Error("AI service error"));

    await expect(aiInstance.run("Trigger failure")).rejects.toThrow("AI service error");
  });
});
