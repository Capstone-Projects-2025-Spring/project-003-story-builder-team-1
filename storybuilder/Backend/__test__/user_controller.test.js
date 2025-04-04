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

// Function to generate a valid ObjectId
function generate_valid_object_id() {
    return new mongoose.Types.ObjectId().toString();
}

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

describe("user_detail tests", () => {
    // Setup a new user and associated stories before each test
    beforeEach(async () => {
        user = new User({
            username: "alice",
            password: "secret",  // This will be hashed by the pre-save middleware
        });
        await user.save();
        
        story_1 = new Story({
            story_name: "First Story",
            prompt: "Write about a dragon.",
            content: "Once upon a time...",
            user: user._id,  // Link to the user
        });
        story_2 = new Story({
            story_name: "Second Story",
            prompt: "A haunted house mystery.",
            content: "It was a dark night...",
            user: user._id,  // Link to the user
        });

        await story_1.save();
        await story_2.save();

        user.stories = [story_1._id, story_2._id];
        await user.save();
    });
    
    // Test cases for the API routes

    it("should return user details including populated stories", async () => {
        const res = await request(app).get(`/db/user/${user._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBe("alice");
        expect(res.body.stories).toHaveLength(2);
        expect(res.body.stories[0]).toHaveProperty("story_name", "First Story");
        expect(res.body.stories[1]).toHaveProperty("story_name", "Second Story");
    });

    it("should return 404 if user not found", async () => {
        const test_user_id = generate_valid_object_id();
        const res = await request(app).get(`/db/user/${test_user_id}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });

    it("should return 500 if user ID is invalid", async () => {
        const res = await request(app).get("/db/user/invalid_id");

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe(undefined);
    });
});