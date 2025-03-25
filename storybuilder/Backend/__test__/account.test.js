const request = require('supertest');
const axios = require('axios');
const app = require('../app');

jest.mock('axios');

describe("POST /account_creation", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //Test Case 1: if a required field is empty
    it("should return 404 if required fields are missing", async () => {

        const input = {
          username: "Kyle",
          password: null
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(404);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: "Missing required fields", data: input});
    });

    //Test Case 2: if username is not alphanumeric
    it("should return 400 if username is not alphanumeric", async () => {

        const input = {
          username: "Kyle@",
          password: "password"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: "Username must be alphanumeric"});
    });

    //Test Case 3: if password is not 8 characters long
    it("should return 400 if password is not 8 characters long", async () => {

        const input = {
          username: "Kyle",
          password: "Pass!"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: `Password must meet the following criteria:\n
                • At least 8 characters long\n
                • Include at least one lowercase letter\n
                • Include at least one uppercase letter\n
                • Include at least one number\n
                • Include at least one special character`});
    });

    //Test Case 4: if password does not contain a lowercase letter
    it("should return 400 if password does not contain a lowercase letter", async () => {

        const input = {
          username: "Kyle",
          password: "PASSWORD1!"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: `Password must meet the following criteria:\n
                • At least 8 characters long\n
                • Include at least one lowercase letter\n
                • Include at least one uppercase letter\n
                • Include at least one number\n
                • Include at least one special character`});
    });

    //Test Case 5: if password does not contain an uppercase letter
    it("should return 400 if password does not contain an uppercase letter", async () => {

        const input = {
          username: "Kyle",
          password: "password1!"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: `Password must meet the following criteria:\n
                • At least 8 characters long\n
                • Include at least one lowercase letter\n
                • Include at least one uppercase letter\n
                • Include at least one number\n
                • Include at least one special character`});
    });

    //Test Case 6: if password does not contain a number
    it("should return 400 if password does not contain a number", async () => {

        const input = {
          username: "Kyle",
          password: "Password!"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: `Password must meet the following criteria:\n
                • At least 8 characters long\n
                • Include at least one lowercase letter\n
                • Include at least one uppercase letter\n
                • Include at least one number\n
                • Include at least one special character`});
    });

    //Test Case 7: if password does not contain a special character
    it("should return 400 if password does not contain a special character", async () => {

        const input = {
          username: "Kyle",
          password: "Password1"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: `Password must meet the following criteria:\n
                • At least 8 characters long\n
                • Include at least one lowercase letter\n
                • Include at least one uppercase letter\n
                • Include at least one number\n
                • Include at least one special character`});
    });

    //Test Case 8: if username already exists
    it("should return 400 if username already exists", async () => {

        // Mock axios response
        axios.post.mockResolvedValue({ data: { exists: true } });
    
        const input = {
          username: "Kyle",
          password: "Password1!"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(400);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: "User already exists"});
    });

    //Test Case 9: if account creation is successful
    it("should return 200 if account creation is successful", async () => {

        // Mock axios response
        axios.post.mockResolvedValue({ data: { message: "Account created successfully", user_id: 12345 } });
    
        const input = {
          username: "Kyle",
          password: "Password1!"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(200);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: "Account created successfully", user_id: 12345});
    });

    //Test Case 10: if an internal server error occurs
    it("should return 500 if an internal server error occurs", async () => {

        // Mock axios to return an error
        axios.post.mockRejectedValue(new Error("Internal server error"));
    
        const input = {
          username: "Kyle",
          password: "Password1!"
        }
    
        const response = await request(app)
            .post("/account/account_creation")
            .send(input)
            .expect('Content-Type', /json/)
            .expect(500);
    
        //assert response matches expected output
        expect(response.body).toEqual({message: "Internal server error"});
    });
});