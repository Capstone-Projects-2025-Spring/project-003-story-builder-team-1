const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app"); 
const User = require("../models/user");
const Story = require("../models/story");

let mongo_server;

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

describe("Account Creation Tests", () => {
    const endpoint = "/db/account_creation";

    it("should create a new account a.k.a a new user in the database", async () => {
        const newUser = {
            username: "bob",
            password:"Password123!",
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Account created successfully");
    });

    it("should return 404 if password is missing", async () => {
        const newUser = {
            username: "bob",
            password: null        
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Username and password are required");
    });

    it("should return 404 if username is missing", async () => {
        const newUser = {
            username: null,
            password: "Password123!"       
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Username and password are required");
    });

    it("should return 400 if username already exists", async () => {
        const existingUser = new User({
            username: "bob",
            password: "Password123!"
        });
        await existingUser.save();

        const newUser = {
            username: "bob",
            password: "AnotherPassword123!"
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username already exists");
    });

    it("should return 400 if username is not alphanumeric", async () => {
        const newUser = {
            username: "bob@123",
            password: "Password123!"
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Username must be alphanumeric");
    });

    it("should return 400 if password is less than 8 characters", async () => {
        const newUser = {
            username: "bob",
            password: "short"
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password must meet the security criteria.");
    });

    it("should return 400 if password does not have a capital letter", async () => {
        const newUser = {
            username: "bob",
            password: "password123!"
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password must meet the security criteria.");
    });

    it("should return 400 if password does not have a lower case letter", async () => {
        const newUser = {
            username: "bob",
            password: "PASSWORD123!"
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password must meet the security criteria.");
    });

    it("should return 400 if password does not have a number", async () => {
        const newUser = {
            username: "bob",
            password: "Password!"
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password must meet the security criteria.");
    });

    it("should return 400 if password does not have a special character", async () => {
        const newUser = {
            username: "bob",
            password: "Password123"
        };
        const res = await request(app).post(endpoint).send(newUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password must meet the security criteria.");
    });
});

describe("Account Login Tests", () => {
    const endpoint = "/db/account_login";
    
    beforeEach(async () => {
        const newUser = new User({
            username: "bob",
            password: "Password123!",
        });
        await newUser.save();
    });

    it("should log in an existing user", async () => {
        const loginData = {
            username: "bob",
            password: "Password123!",
        };
        const res = await request(app).post(endpoint).send(loginData);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful");
    });

    it("should return 404 if password is missing", async () => {
        const loginData = {
            username: "bob",
            password: null
        };
        const res = await request(app).post(endpoint).send(loginData);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Username and password are required");
    });

    it("should return 404 if username is missing", async () => {
        const loginData = {
            username: null,
            password: "Password123!"
        };
        const res = await request(app).post(endpoint).send(loginData);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Username and password are required");
    });

    it("should return 400 if username does not exist", async () => {
        const loginData = {
            username: "nonexistent_user",
            password: "Password123!"
        };
        const res = await request(app).post(endpoint).send(loginData);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid username or password");
    });

    it("should return 400 if password is incorrect", async () => {
        const loginData = {
            username: "bob",
            password: "WrongPassword123!"
        };
        const res = await request(app).post(endpoint).send(loginData);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid username or password");
    });
});

describe("User Deletion Tests", () => {
    beforeEach(async () => {
        const newUser = new User({
            username: "bob",
            password: "Password123!",
        });
        await newUser.save();
    });

    it("should delete an existing user", async () => {  
        const user = await User.findOne({ username: "bob" });
        const res = await request(app).post(`/db/user/${user._id}/delete`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User deleted successfully"); 
    });

    it("should return 404 if user not found", async () => {
        const test_user_id = generate_valid_object_id();
        const res = await request(app).post(`/db/user/${test_user_id}/delete`);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });

    it("should return 500 if user ID is invalid", async () => {
        const res = await request(app).post("/db/user/invalid_id/delete");
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe(undefined);
    });

});

describe("User Update Tests", () => {
    beforeEach(async () => {
        const newUser = new User({
            username: "bob",
            password: "Password123!",
        });
        await newUser.save();
    });

    it("should update an existing user's details", async () => {
        const user = await User.findOne({ username: "bob" });
        const updatedData = {
            username: "bob_updated",
            password: "NewPassword123!"
        };
        const res = await request(app).post(`/db/user/${user._id}/update`).send(updatedData);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User updated successfully");
        expect(res.body.user.username).toBe("bob_updated");
    });

    it("should update only the password if username is not provided", async () => {
        const user = await User.findOne({ username: "bob" });
        const updatedData = {
            password: "NewPassword123!"
        };
        const res = await request(app).post(`/db/user/${user._id}/update`).send(updatedData);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User updated successfully");
        expect(res.body.user.username).toBe("bob");
    });

    it("should update only the username if password is not provided", async () => {
        const user = await User.findOne({ username: "bob" });
        const updatedData = {
            username: "bob_updated"
        };
        const res = await request(app).post(`/db/user/${user._id}/update`).send(updatedData);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User updated successfully");
        expect(res.body.user.username).toBe("bob_updated");
    });

    it("should return 404 if user ID is not found", async () => {
        const test_user_id = generate_valid_object_id();
        const updatedData = {
            username: "bob_updated",
            password: "NewPassword123!"
        };
        const res = await request(app).post(`/db/user/${test_user_id}/update`).send(updatedData);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });

    it("should return 500 if user ID is invalid", async () => {
        const res = await request(app).post("/db/user/invalid_id/update");
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe(undefined);
    });
});

describe("user_detail tests", () => {
    let user;
    let story_1;
    let story_2;

    // Setup a new user and associated stories before each test
    beforeEach(async () => {
        user = new User({
            username: "alice",
            password: "Password123!",
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