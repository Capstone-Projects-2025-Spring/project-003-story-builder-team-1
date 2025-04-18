// __test__/mockLlama.test.js
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

describe("LlamaAI Mock Test", () => {
  it("should return a mocked response", async () => {
    const aiInstance = new MockedLlamaAI();
    const response = await aiInstance.run("Test message");

    expect(response).toEqual({
      choices: [{ message: { content: "Mocked AI response" } }],
    });
  });
});