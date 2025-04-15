const request = require('supertest');
const express = require('express');
const axios = require('axios');
const courierRouter = require('../routes/courier');

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/courier', courierRouter);

describe('Courier Routes', () => {
    describe('POST /courier/story_call', () => {
        it('should handle a successful story_call request', async () => {
            const mockRequestData = {
                messages: "Test message",
                data: { key: "value" }
            };

            const mockAgentResponse = { response: { content: "Agent response" }};
            axios.post.mockResolvedValueOnce({ data: mockAgentResponse });
            axios.post.mockResolvedValueOnce({}); // Mock the translator response

            const response = await request(app)
                .post('/courier/story_call')
                .send(mockRequestData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Data Received Successfully",
                data: mockRequestData
            });

            expect(axios.post).toHaveBeenCalledWith(
                "http://localhost:5000/agent/generate",
                mockRequestData.data,
                { headers: { "Content-Type": "application/json" } }
            );

            expect(axios.post).toHaveBeenCalledWith(
                "http://localhost:8080/translator/courier_response",
                { data: mockAgentResponse.response.content },
                { headers: { "Content-Type": "application/json" } }
            );
        });

        it('should handle errors in story_call request', async () => {
            const mockRequestData = {
                messages: "Test message",
                data: { key: "value" }
            };

            axios.post.mockRejectedValueOnce(new Error("Agent API error"));

            const response = await request(app)
                .post('/courier/story_call')
                .send(mockRequestData);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: "Internal Server Error",
                details: "Agent API error"
            });
        });
    });

    describe('POST /courier/story_push', () => {
        it('should handle a successful story_push request', async () => {
            const mockRequestData = { key: "value" };

            const response = await request(app)
                .post('/courier/story_push')
                .send(mockRequestData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Data Received Successfully",
                data: mockRequestData
            });
        });
    });

    describe('GET /courier/judge', () => {
        it('should handle a successful judge request', async () => {
            const mockQueryData = { key: "value" };

            const response = await request(app)
                .get('/courier/judge')
                .query(mockQueryData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Data Received Successfully",
                data: mockQueryData
            });
        });
    });
});