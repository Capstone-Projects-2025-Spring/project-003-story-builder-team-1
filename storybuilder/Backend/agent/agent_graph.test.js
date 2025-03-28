const { Graph, Node } = require("langgraph");
const axios = require("axios");
const { jest } = require("@jest/globals");
const { Supervisor, StoryAgent, Voting, runStoryBuilder } = require("./agent_graph");

jest.mock("axios");

describe("Agent Graph Tests", () => {
    let graph, supervisor, titleAgent, chapterAgent, voting;

    beforeEach(() => {
        graph = new Graph();
        supervisor = graph.addNode("supervisor", new Supervisor());
        titleAgent = graph.addNode("titleAgent", new StoryAgent());
        chapterAgent = graph.addNode("chapterAgent", new StoryAgent());
        voting = graph.addNode("voting", new Voting());

        graph.addEdge(supervisor, titleAgent, { task: "Write a story title and outline." });
        graph.addEdge(titleAgent, voting, { choices: ["result"] });
        graph.addEdge(voting, chapterAgent, { task: "Write the first chapter based on the selected outline." });
    });

    test("Supervisor node processes prompt correctly", async () => {
        const context = { input: { prompt: "Test prompt" }, memory: {} };
        const result = await supervisor.run(context);

        expect(result).toEqual({ prompt: "Test prompt" });
        expect(context.memory.prompt).toBe("Test prompt");
    });

    test("StoryAgent node interacts with Llama 3 API", async () => {
        const context = {
            input: { task: "Write a story title and outline." },
            memory: { prompt: "Test prompt" }
        };

        axios.post.mockResolvedValueOnce({ data: { result: "Generated story title and outline" } });

        const result = await titleAgent.run(context);

        expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/llama3", {
            model: "llama3.1-8b",
            messages: [
                { role: "system", content: "You are a helpful assistant helping to write a story." },
                { role: "user", content: "Write a story title and outline.\n\nTest prompt" }
            ],
            stream: false
        });
        expect(result).toEqual({ result: "Generated story title and outline" });
    });

    test("Voting node selects the first choice", async () => {
        const context = { input: { choices: ["Choice 1", "Choice 2", "Choice 3"] } };
        const result = await voting.run(context);

        expect(result).toEqual({ result: "Choice 1" });
    });

    test("Graph runs end-to-end and generates a story", async () => {
        axios.post
            .mockResolvedValueOnce({ data: { result: "Generated story title and outline" } })
            .mockResolvedValueOnce({ data: { result: "Generated first chapter" } });

        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        const result = await runStoryBuilder("A futuristic tale about AI and humanity.");

        expect(axios.post).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenCalledWith("Final Story:", {
            result: "Generated first chapter"
        });

        consoleSpy.mockRestore();
    });
});