const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app"); 
const User = require("../models/user");
const Story = require("../models/story");

let mongo_server;
let user;
let story_1;
let story_2;


beforeAll(async () => {
    mongo_server = await MongoMemoryServer.create();
    const uri = mongo_server.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo_server.stop();
});

afterEach(async () => {
    await User.deleteMany();
    await Story.deleteMany();
});

beforeEach(async () => {
    user = await User.create({ username: "testuser", password: "password" });
    story_1 = await Story.create({ story_name: "Story 1", user: user._id, prompt: "Prompt 1" });
    story_2 = await Story.create({ story_name: "Story 2", user: user._id, prompt: "Prompt 2" });
});

describe("Story Routes", () => {
    describe("GET /stories", () => {
        it("should return a list of all stories", async () => {
        
            const res = await request(app).get("/db/stories");
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].story_name).toBe("Story 1");
            expect(res.body[0].prompt).toBe("Prompt 1");
            expect(res.body[1].story_name).toBe("Story 2");
            expect(res.body[1].prompt).toBe("Prompt 2");
            expect(res.body[0].user._id).toBe(user._id.toString());
            expect(res.body[1].user._id).toBe(user._id.toString());
        });
    });

    describe("GET /story/:id", () => {
        it("should return a specific story by ID", async () => {
            story_1 = await Story.create({ story_name: "Story 1", user: user._id, prompt: "Prompt 1" });

            const res = await request(app).get(`/db/story/${story_1._id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.story_name).toBe("Story 1");
        });

        
    });

    describe("POST /story/create", () => {
        it("should create a new story", async () => {
            user = await User.create({ username: "testuser", password: "password" });

            const res = await request(app)
                .post("/db/story/create")
                .send({ story_name: "New Story", user: user._id, prompt: "New Prompt" });

            expect(res.statusCode).toBe(201);
            expect(res.body.story.story_name).toBe("New Story");
        });

        it("should return 400 if required fields are missing", async () => {
            const res = await request(app).post("/db/story/create").send({});
            expect(res.statusCode).toBe(400);
        });
    });

    describe("POST /story/:id/delete", () => {
        it("should delete a story by ID", async () => {
            story_1 = await Story.create({ story_name: "Story 1", user: user._id, prompt: "Prompt 1" });

            const res = await request(app).post(`/db/story/${story_1._id}/delete`);
            expect(res.statusCode).toBe(200);

            const deletedStory = await Story.findById(story_1._id);
            expect(deletedStory).toBeNull();
        });
    });

    describe("POST /story/:id/update", () => {
        it("should update a story by ID", async () => {
            story_1 = await Story.create({ story_name: "Story 1", user: user._id, prompt: "Prompt 1" });

            const res = await request(app)
                .post(`/db/story/${story_1._id}/update`)
                .send({ story_name: "Updated Story", prompt: "Updated Prompt" });

            expect(res.statusCode).toBe(200);
            expect(res.body.story.story_name).toBe("Updated Story");
        });
    });

    describe("GET /story/:id/:chapter_number", () => {
        it("should return a specific chapter of a story", async () => {
            story_1 = await Story.create({
                story_name: "Story 1",
                user: user._id,
                prompt: "Prompt 1",
                story_content: [{ story_chapter_number: 1, text: "Chapter 1 content" }]
            });

            const res = await request(app).get(`/db/story/${story_1._id}/1`);
            expect(res.statusCode).toBe(200);
            expect(res.body.text).toBe("Chapter 1 content");
        });

        it("should return 404 if chapter is not found", async () => {
            story_1 = await Story.create({ story_name: "Story 1", user: user._id, prompt: "Prompt 1" });

            const res = await request(app).get(`/db/story/${story_1._id}/1`);
            expect(res.statusCode).toBe(404);
        });
    });

    describe("POST /story/:id/:chapter_number/edit", () => {
        it("should edit a chapter of a story", async () => {
            story_1 = await Story.create({ story_name: "Story 1", user: user._id, prompt: "Prompt 1" });

            const res = await request(app)
                .post(`/db/story/${story_1._id}/1/edit`)
                .send({ text: "Updated Chapter 1 content" });

            expect(res.statusCode).toBe(200);
            expect(res.body.story_content[0].text).toBe("Updated Chapter 1 content");
        });
    });

    describe("POST /story/:id/:chapter_number/veto/:agent_id", () => {
        it("should promote an agent's chapter version to final story content", async () => {
            story_1 = await Story.create({
                story_name: "Story 1",
                user: user._id,
                prompt: "Prompt 1",
                agents: [
                    {
                        agent: new mongoose.Types.ObjectId(),  
                        chapters: [{ chapter_number: 1, content: "Agent Chapter 1 content" }]
                    }
                ]
            });
    
            const agent_id = story_1.agents[0].agent;
            const res = await request(app).post(`/db/story/${story_1._id}/1/veto/${agent_id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.story_content[0].text).toBe("Agent Chapter 1 content");
        });
    });

    describe("POST /story/:id/outline/create", () => {
        it("should create an outline for a story", async () => {
            story_1 = await Story.create({ story_name: "Story 1", user: user._id, prompt: "Prompt 1" });

            const res = await request(app)
                .post(`/db/story/${story_1._id}/outline/create`)
                .send({ chapter_numbers: [1, 2], agents: new [mongoose.Types.ObjectId()] });

            expect(res.statusCode).toBe(201);
            expect(res.body.agents.length).toBe(1);
        });
    });
    
    // test the 
    
})