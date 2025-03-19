const request = require('supertest');
const axios = require('axios');
const app = require('../app');

jest.mock("axios");

//story_contents tests
describe("POST /app/story_contents/", () => {
  beforeEach(() => {
      jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
          .post("/app/story_contents/")
          .send({ story_name: "My Story", story_details: "Some details" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Missing required fields");
  });

  it("should return 400 if chapter_count is not a number", async () => {
      const res = await request(app)
          .post("/app/story_contents/")
          .send({
              chapter_count: "not_a_number",
              story_name: "My Story",
              story_details: "Some details",
              extra_details: "Extra info"
          });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid Data Type: chapter_count must be a number");
  });

  it("should return 200 and include the courier_response if request is valid", async () => {
      // Mock axios response
      axios.post.mockResolvedValue({ data: { message: "Courier response success" } });

      const res = await request(app)
          .post("/app/story_contents/")
          .send({
              chapter_count: 5,
              story_name: "My Story",
              story_details: "Some details",
              extra_details: "Extra info"
          });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Story Contents Received Successfully");
      expect(res.body.data).toHaveProperty("title", "My Story");
      expect(res.body.data).toHaveProperty("courier_response");
      expect(res.body.data.courier_response).toEqual({ message: "Courier response success" });
  });

  it("should return 500 if courier_response API fails", async () => {
      // Mock axios to return an error
      axios.post.mockRejectedValue(new Error("Courier API error"));

      const res = await request(app)
          .post("/app/story_contents/")
          .send({
              chapter_count: 3,
              story_name: "Error Story",
              story_details: "Some details",
              extra_details: "Extra info"
          });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("message", "Failed to fetch courier response");
      expect(res.body).toHaveProperty("error", "Courier API error");
  });
});

// //courier_response tests
// describe('POST /app/courier_response/', () => {

//   //Test Case 4: translator Successfully Receives Courier Response
//   it('should return 200 and a success message with the input data', async () => {
    
//     //Define input data
//     const input_data = {"data": "Courier Response"};
    
//     //Post Request
//     const response = await request(app)
//       .post('/app/courier_response/')
//       .send(input_data)
//       .expect('Content-Type', /json/)
//       .expect(200);

//     //assert response matches expected output
//     expect(response.body).toEqual({message: "Courier Response Received Successfully", data: input_data});
//   });

//   //Test Case 5: translator Unsuccessfully Receives Courier Response
//   it('should return 404 and an error message with the input data', async () => {
    
//     //Define input data
//     const input_data = {"data": null};
    
//     //Post Request
//     const response = await request(app)
//       .post('/app/courier_response/')
//       .send(input_data)
//       .expect('Content-Type', /json/)
//       .expect(404);

//     //assert response matches expected output
//     expect(response.body).toEqual({message: "Courier Response not Received", data: input_data});
//   });
// });

// //story tests
// describe('GET /app/story/', () => {

//   //Test Case 6: Sending Story Data
//   it('should return 200 and an success message with the received data', async () => {
    
//     //Define input data
//     const input_data = {
//       "chapter_count": 10,
//       "story_name": "Story Name",
//       "story_details": "Story Detail",
//       "extra_details": "Extra Detail"
//     };

//     //Post Request for Data
//     await request(app)
//       .post('/app/story_contents/')
//       .send(input_data)
//       .expect('Content-Type', /json/)
//       .expect(200);

//     //Get Request for test_send
//     details = 'Story Details:\n"Story Detail"\nExtra Details:\n"Extra Detail"'
//     const response = await request(app)
//     .get('/app/story/')
//     .expect('Content-Type', /json/)
//     .expect(200);

//     //assert response matches expected output
//     expect(response.body).toEqual({message: "Sending Data to prompt_admin", data: details});
//   });
// });

// //courier_data tests
// describe('GET /app/courier_data/', () => {

//   //Test Case 7: Sending Courier Data
//   it('should return 200 and an success message with the received data', async () => {
    
//     //Define input data
//     const input_data = {
//       "chapter_count": 10,
//       "story_name": "Story Name",
//       "story_details": "Story Detail",
//       "extra_details": "Extra Detail"
//     };
//     const courier_data = {"data": "Courier Response"};

//     //Post Request for Data
//     await request(app)
//       .post('/app/story_contents/')
//       .send(input_data)
//       .expect('Content-Type', /json/)
//       .expect(200);

//     //Post Request for courier_Response
//     await request(app)
//     .post('/app/courier_response/')
//     .send(courier_data)
//     .expect('Content-Type', /json/)
//     .expect(200);

//     //Get Request for test_send
//     const response = await request(app)
//     .get('/app/courier_data/')
//     .expect('Content-Type', /json/)
//     .expect(200);

//     //assert response matches expected output
//     for_frontend = {
//       "title": '"Story Name"',
//       "courier_response": '"Courier Response"'
//   };
//     expect(response.body).toEqual({message: "Sending Data to the Frontend", data: for_frontend});
//   });
// });