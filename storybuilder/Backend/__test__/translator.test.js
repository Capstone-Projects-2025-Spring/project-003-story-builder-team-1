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

  it('should return 400 and an error message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": "Test"};
    
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

//Test Case 3: Story Details Successfully Receives Story Details
describe('POST /app/story_details/', () => {

  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": "Story Detail"};
    
    //Post Request
    const response = await request(app)
      .post('/app/story_details/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Story Details Received Successfully", data: inputData});

  });
});

//Test Case 4: Story Details Unsuccessfully Receives Story Details
describe('POST /app/story_details/', () => {

  it('should return 404 and an error message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/app/story_details/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Story Details were not Received", data: inputData});

  });
});

//Test Case 5: Extra Details Successfully Receives Story Details
describe('POST /app/extra_details/', () => {

  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": "Story Detail"};
    
    //Post Request
    const response = await request(app)
      .post('/app/extra_details/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Extra Details Received Successfully", data: inputData});

  });
});

//Test Case 6: Extra Details Unsuccessfully Receives Story Details
describe('POST /app/extra_details/', () => {

  it('should return 404 and an error message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/app/extra_details/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Extra Details were not Received", data: inputData});

  });
});

//Test Case 7: Extra Details Successfully Receives Story Details
describe('POST /app/courier_response/', () => {

  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": "Story Detail"};
    
    //Post Request
    const response = await request(app)
      .post('/app/courier_response/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Courier Response Received Successfully", data: inputData});

  });
});

//Test Case 8: Extra Details Unsuccessfully Receives Story Details
describe('POST /app/courier_response/', () => {

  it('should return 404 and an error message with the input data', async () => {
    
    //Define input data
    const inputData = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/app/courier_response/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Courier Response were not Received", data: inputData});

  });
});