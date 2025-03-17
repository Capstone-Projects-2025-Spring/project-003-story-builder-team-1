const request = require('supertest');
const app = require('../app');

//Test Case 1: Chapter Count Successfully Receive Numerical Data for Chapter Count
describe('POST /app/chapter_count/', () => {

  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": 10};
    
    //Post Request
    const response = await request(app)
      .post('/app/chapter_count/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Chapter Count Received Successfully", data: inputData});

  });
});

//Test Case 2: Chapter Count Unsuccessfully Receive Non-Numeric Data
describe('POST /app/chapter_count/', () => {

  it('should return 400 and a error message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": "fail"};
    
    //Post Request
    const response = await request(app)
      .post('/app/chapter_count/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(400);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Invalid Data Type", data: inputData});

  });
});