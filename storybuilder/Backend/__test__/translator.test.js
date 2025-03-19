const request = require('supertest');
const axios = require('axios');
const app = require('../app');

jest.mock("axios");

//story_contents tests
describe("POST /app/story_contents/", () => {

  //Resets all mock async requests before each test
  beforeEach(() => {
      jest.clearAllMocks();
  });

  //Test Case 1: if a required field is empty
  it("should return 400 if required fields are missing", async () => {

    const input = {
      chapter_count: 5,
      story_name: "Story Name",
      story_details: "Story Detail",
      extra_details: null
    }

    const response = await request(app)
        .post("/app/story_contents/")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Missing required fields", data: input});
  });

  //Test Case 2: if chapter_count is not a number
  it("should return 400 if chapter_count is not a number", async () => {

    // Mock axios response
    axios.post.mockResolvedValue({message: "Courier Response Received Successfully", data: "Courier Response"});

    const input = {
      chapter_count: "Test",
      story_name: "Story Name",
      story_details: "Story Detail",
      extra_details: "Extra Detail"
    }

    const response = await request(app)
        .post("/app/story_contents/")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Invalid Data Type: chapter_count must be a number", data: "Test"});
  });

  //Test Case 3: if data is received, courier esponse is given, and all data is sent back to Frontend
  it("should return 200 and include the courier_response if request is valid", async () => {

    // Mock axios response
    axios.post.mockResolvedValue({message: "Courier Response Received Successfully", data: "Courier Response"});

    const input = {
      chapter_count: 5,
      story_name: "Story Name",
      story_details: "Story Detail",
      extra_details: "Extra Detail"
    }

    const response = await request(app)
        .post("/app/story_contents/")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(200)

    //assert response matches expected output
    to_frontend = {
      title: "Story Name",
      courier_response: "Courier Response"
    }
    expect(response.body).toEqual({"message": "Story Contents Received Successfully", data: to_frontend});
  });

  //Test Case 4: if API call to courier_response fails
  it("should return 500 if courier_response API fails", async () => {

    // Mock axios to return an error
    axios.post.mockRejectedValue(new Error("Courier API error"));

    const input = {
      chapter_count: 5,
      story_name: "Story Name",
      story_details: "Story Detail",
      extra_details: "Extra Detail"
    }

    const response = await request(app)
        .post("/app/story_contents/")
        .send(input);

    //assert response matches expected output
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Failed to fetch courier response");
    expect(response.body).toHaveProperty("error", "Courier API error");
  });
});

//courier_response tests
describe('POST /app/courier_response/', () => {

  //Test Case 5: translator Successfully Receives Courier Response
  it('should return 200 and a success message with the input data', async () => {
    
    const input = {"data": "Courier Response"};
    
    //Post Request
    const response = await request(app)
      .post('/app/courier_response/')
      .send(input)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Courier Response Received Successfully", data: input});
  });

  //Test Case 6: translator Unsuccessfully Receives Courier Response
  it('should return 404 and an error message with the input data', async () => {
    
    const input = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/app/courier_response/')
      .send(input)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Courier Response not Received", data: input});
  });
});

//story tests
describe('GET /app/story/', () => {

  //Test Case 7: Sending Story Data
  it('should return 200 and an success message with the received data', async () => {

    // Mock axios response
    axios.post.mockResolvedValue({message: "Courier Response Received Successfully", data: "Courier Response"});

    const input = {
      chapter_count: 5,
      story_name: "Story Name",
      story_details: "Story Detail",
      extra_details: "Extra Detail"
    }

    await request(app)
        .post("/app/story_contents/")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(200)
    
    //Get Request for story
    details = 'Story Details:\n"Story Detail"\nExtra Details:\n"Extra Detail"'
    const response = await request(app)
    .get('/app/story/')
    .expect('Content-Type', /json/)
    .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Sending Data to prompt_admin", data: details});
  });
});

//courier_data tests
describe('GET /app/courier_data/', () => {

  //Test Case 8: Sending Courier Data
  it('should return 200 and an success message with the received data', async () => {
    
    // Mock axios response
    axios.post.mockResolvedValue({message: "Courier Response Received Successfully", data: "Courier Response"});

    const input = {
      chapter_count: 5,
      story_name: "Story Name",
      story_details: "Story Detail",
      extra_details: "Extra Detail"
    }

    await request(app)
        .post("/app/story_contents/")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(200)

    //Get Request for courier_data
    const response = await request(app)
    .get('/app/courier_data/')
    .expect('Content-Type', /json/)
    .expect(200);

    //assert response matches expected output
    for_frontend = {
      "title": "Story Name",
      "courier_response": "Courier Response"
  };
    expect(response.body).toEqual({message: "Sending Data to the Frontend", data: for_frontend});
  });
});