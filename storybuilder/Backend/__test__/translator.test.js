const request = require('supertest');
const axios = require('axios');
const app = require('../app');

jest.mock("axios");

//first_chapter tests
describe("POST /first_chapter", () => {

  //Resets all mock async requests before each test
  beforeEach(() => {
      jest.clearAllMocks();
  });

  //Test Case 1: if a required field is empty
  it("should return 404 if required fields are missing", async () => {

    const input = {
      "story_name": "Story Name",
      "story_details": null,
      "extra_details": "Extra Detail",
      "story_outline": "Story Outline"
    }

    const response = await request(app)
        .post("/translator/first_chapter")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Missing required fields", data: input});
  });

  //Test Case 2: if data is received and courier response is given, courier_response data is sent back to Frontend
  it("should return 200 and include the courier_response if request is valid", async () => {

    // Mock axios response
    axios.post.mockResolvedValue({message: "Story Data Received Successfully", status: 200});
    
    const input = {
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail",
      "story_outline": "Story Outline"
    }

    //posting courier_response data
    await request(app)
    .post("/translator/courier_response")
    .send({"data": "Courier Response"})
    .expect('Content-Type', /json/)
    .expect(200)

    const response = await request(app)
        .post("/translator/first_chapter")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(200)

    //assert response matches expected output
    to_frontend = {
      "title": "Story Name",
      "courier_response": "Courier Response"
    }
    expect(response.body).toEqual({"message": "Story Contents Received Successfully", data: to_frontend});
  });

  //Test Case 3: if API call to courier_response fails
  it("should return 500 if courier_response API fails", async () => {

    // Mock axios to return an error
    axios.post.mockRejectedValue(new Error("Courier API error"));

    const input = {
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail",
      "story_outline": "Story Outline"
    }

    const response = await request(app)
        .post("/translator/first_chapter")
        .send(input)
        .expect(500)

    //assert response matches expected output
    expect(response.body).toEqual({"message": "Failed to fetch courier response", "error": "Courier API error"});
  });
});

//courier_response tests
describe('POST /courier_response', () => {

  //Test Case 4: translator Successfully Receives Courier Response
  it('should return 200 and a success message with the input data', async () => {
    
    const input = {"data": "Courier Response"};
    
    //Post Request
    const response = await request(app)
      .post('/translator/courier_response')
      .send(input)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Courier Response Received Successfully", data: input});
  });

  //Test Case 5: translator Unsuccessfully Receives Courier Response
  it('should return 404 and an error message with the input data', async () => {
    
    const input = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/translator/courier_response')
      .send(input)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Courier Response not Received", data: input});
  });
});

//story_outline tests
describe("POST /story_outline", () => {

  //Resets all mock async requests before each test
  beforeEach(() => {
      jest.clearAllMocks();
  });

  //Test Case 6: if a required field is empty
  it("should return 404 if required fields are missing", async () => {

    const input = {
      "chapter_count": 5,
      "story_name": "Story Name",
      "story_details": null,
      "extra_details": "Extra Detail"
    }

    const response = await request(app)
        .post("/translator/story_outline")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Missing required fields", data: input});
  });

  //Test Case 7: if chapter_count is not a number
  it("should return 400 if chapter_count is not a number", async () => {

    // Mock axios response
    axios.post.mockResolvedValue({message: "Story Data Received Successfully", status: 200});

    const input = {
      "chapter_count": "Test",
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail"
    }

    const response = await request(app)
        .post("/translator/story_outline")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Invalid Data Type: chapter_count must be a number", data: "Test"});
  });

  //Test Case 8: if data is received and courier response is given, courier_response data is sent back to Frontend
  it("should return 200 and include the courier_response if request is valid", async () => {

    // Mock axios response
    axios.post.mockResolvedValue({message: "Story Data Received Successfully", status: 200});

    const input = {
      "chapter_count": 5,
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail"
    }

    //posting courier_response data
    await request(app)
    .post("/translator/courier_response")
    .send({"data": "Courier Response"})
    .expect('Content-Type', /json/)
    .expect(200)

    const response = await request(app)
        .post("/translator/story_outline")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(200)

    //assert response matches expected output
    to_frontend = {
      "title": "Story Name",
      "courier_response": "Courier Response"
    }
    expect(response.body).toEqual({"message": "Story Contents Received Successfully", data: to_frontend});
  });

  //Test Case 9: if API call to courier_response fails
  it("should return 500 if courier_response API fails", async () => {

    // Mock axios to return an error
    axios.post.mockRejectedValue(new Error("Courier API error"));

    const input = {
      "chapter_count": 5,
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail"
    }

    const response = await request(app)
        .post("/translator/story_outline")
        .send(input)
        .expect(500)

    //assert response matches expected output
    expect(response.body).toEqual({"message": "Failed to fetch courier response", "error": "Courier API error"});
  });
});

//next_chapter tests
describe("POST /next_chapter", () => {

  //Resets all mock async requests before each test
  beforeEach(() => {
      jest.clearAllMocks();
  });

  //Test Case 9: if a required field is empty
  it("should return 404 if required fields are missing", async () => {

    const input = {
      "story_name": "Story Name",
      "story_details": null,
      "extra_details": "Extra Detail",
      "previous_chapters": ["Chapter 1", "Chapter 2"],
      "story_outline": "Story Outline"
    }

    const response = await request(app)
        .post("/translator/next_chapter")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Missing required fields", data: input});
  });

  //Test Case 10: if previous_chapters is empty
  it("should return 400 if chapter_count is not a number", async () => {

    // Mock axios response
    axios.post.mockResolvedValue({message: "Story Data Received Successfully", status: 200});

    const input = {
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail",
      "previous_chapters": [],
      "story_outline": "Story Outline"
    }

    const response = await request(app)
        .post("/translator/next_chapter")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(400);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Invalid Data Type: previous_chapters is empty", data: []});
  });

  //Test Case 11: if data is received and courier response is given, courier_response data is sent back to Frontend
  it("should return 200 and include the courier_response if request is valid", async () => {

    // Mock axios response
    axios.post.mockResolvedValue({message: "Story Data Received Successfully", status: 200});

    const input = {
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail",
      "previous_chapters": ["Chapter 1", "Chapter 2"],
      "story_outline": "Story Outline"
    }

    //posting courier_response data
    await request(app)
    .post("/translator/courier_response")
    .send({"data": "Courier Response"})
    .expect('Content-Type', /json/)
    .expect(200)

    const response = await request(app)
        .post("/translator/next_chapter")
        .send(input)
        .expect('Content-Type', /json/)
        .expect(200)

    //assert response matches expected output
    to_frontend = {
      "title": "Story Name",
      "courier_response": "Courier Response"
    }
    expect(response.body).toEqual({"message": "Story Contents Received Successfully", data: to_frontend});
  });

  //Test Case 12: if API call to courier_response fails
  it("should return 500 if courier_response API fails", async () => {

    // Mock axios to return an error
    axios.post.mockRejectedValue(new Error("Courier API error"));

    const input = {
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail",
      "previous_chapters": ["Chapter 1", "Chapter 2"],
      "story_outline": "Story Outline"
    }

    const response = await request(app)
        .post("/translator/next_chapter")
        .send(input)
        .expect(500)

    //assert response matches expected output
    expect(response.body).toEqual({"message": "Failed to fetch courier response", "error": "Courier API error"});
  });
});