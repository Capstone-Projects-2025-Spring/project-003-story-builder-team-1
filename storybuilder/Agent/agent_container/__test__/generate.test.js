import request from "supertest";
import express from "express";
import agent_routes from "../routes/generate";
import { jest } from "@jest/globals";

describe("POST /generate", () => {
    let app;
    let mockLlama;

    beforeEach(() => {
        mockLlama = {
            run: jest.fn(),
        };
        app = express();
        app.use(express.json());
        app.use("/", agent_routes(mockLlama));
    });

    it("should return 400 if messages are not provided in the request body", async () => {
        const response = await request(app).post("/generate").send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Message is required" });
    });

    it("should return 200 and the AI response if the request is valid", async () => {
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: "Hello, this is a test response.",
                    },
                },
            ],
        };
        mockLlama.run.mockResolvedValue(mockResponse);

        const response = await request(app)
            .post("/generate")
            .send({ messages: ["Test message"] });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ "response": {"content": "Hello, this is a test response.",},});
        expect(mockLlama.run).toHaveBeenCalledWith({ messages: ["Test message"] });
    });

    it("should return 500 if llama.run throws an error", async () => {
        mockLlama.run.mockRejectedValue(new Error("Mock error"));

        const response = await request(app)
            .post("/generate")
            .send({ messages: ["Test message"] });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Failed to get response from LLM" });
        expect(mockLlama.run).toHaveBeenCalledWith({ messages: ["Test message"] });
    });
});