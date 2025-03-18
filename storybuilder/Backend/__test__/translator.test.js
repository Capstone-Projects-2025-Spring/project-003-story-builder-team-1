const request = require('supertest');
const app = require('../app');

//chapter_count tests
describe('POST /app/chapter_count/', () => {

  //Test Case 1: Chapter Count Successfully Receive Numerical Data for Chapter Count
  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": 10};
    
    //Post Request
    const response = await request(app)
      .post('/app/chapter_count/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Chapter Count Received Successfully", data: input_data});
  });

  //Test Case 2: Chapter Count Unsuccessfully Receive Non-Numeric Data
  it('should return 400 and an error message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": "Test"};
    
    //Post Request
    const response = await request(app)
      .post('/app/chapter_count/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(400);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Invalid Data Type", data: input_data});
  });

    //Test Case 3: Chapter Count Unsuccessfully Receive Non-Numeric Data
    it('should return 404 and an error message with the input data', async () => {
    
      //Define input data
      const input_data = {"data": null};
      
      //Post Request
      const response = await request(app)
        .post('/app/chapter_count/')
        .send(input_data)
        .expect('Content-Type', /json/)
        .expect(404);
  
      //assert response matches expected output
      expect(response.body).toEqual({message: "Chapter Count was not Received", data: input_data});
    });
});

//story_details tests
describe('POST /app/story_details/', () => {

  //Test Case 4: Story Details Successfully Receives Story Details
  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": "Story Detail"};
    
    //Post Request
    const response = await request(app)
      .post('/app/story_details/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Story Details Received Successfully", data: input_data});
  });

  //Test Case 5: Story Details Unsuccessfully Receives Story Details
  it('should return 404 and an error message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/app/story_details/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Story Details were not Received", data: input_data});
  });
});

//extra_details tests
describe('POST /app/extra_details/', () => {

  //Test Case 6: Extra Details Successfully Receives Story Details
  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": "Extra Detail"};
    
    //Post Request
    const response = await request(app)
      .post('/app/extra_details/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Extra Details Received Successfully", data: input_data});
  });

  //Test Case 7: Extra Details Unsuccessfully Receives Story Details
  it('should return 404 and an error message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/app/extra_details/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Extra Details were not Received", data: input_data});
  });
});

//courier_response tests
describe('POST /app/courier_response/', () => {

  //Test Case 8: Extra Details Successfully Receives Story Details
  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": "Courier Response"};
    
    //Post Request
    const response = await request(app)
      .post('/app/courier_response/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Courier Response Received Successfully", data: input_data});
  });

  //Test Case 9: Extra Details Unsuccessfully Receives Story Details
  it('should return 404 and an error message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/app/courier_response/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Courier Response were not Received", data: input_data});
  });
});

//story tests
describe('GET /app/story/', () => {

  //Test Case 10: Sending Story Data
  it('should return 200 and an success message with the received data', async () => {
    
    //Define input data
    const story_data = {"data": "Story Detail"};
    const extra_data = {"data": "Extra Detail"};

    //Post Request for story_details
    await request(app)
      .post('/app/story_details/')
      .send(story_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //Post Request for extra_details
    await request(app)
      .post('/app/extra_details/')
      .send(extra_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //Get Request for test_send
    let details = 'Story Details:\n"Story Detail"\nExtra Details:\n"Extra Detail"'
    const response = await request(app)
    .get('/app/story/')
    .expect('Content-Type', /json/)
    .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Sending Data to Frontend", data: details});
  });
});

//courier_data tests
describe('GET /app/courier_data/', () => {

  //Test Case 11: Sending Story Data
  it('should return 200 and an success message with the received data', async () => {
    
    //Define input data
    const story_data = {"data": "Story Detail"};
    const extra_data = {"data": "Extra Detail"};
    const courier_data = {"data": "Courier Response"};

    //Post Request for story_details
    await request(app)
      .post('/app/story_details/')
      .send(story_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //Post Request for extra_details
    await request(app)
      .post('/app/extra_details/')
      .send(extra_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //Post Request for courier_Response
    await request(app)
    .post('/app/courier_response/')
    .send(courier_data)
    .expect('Content-Type', /json/)
    .expect(200);

    //Get Request for test_send
    const response = await request(app)
    .get('/app/courier_data/')
    .expect('Content-Type', /json/)
    .expect(200);

    //assert response matches expected output
    details = 'Story Details:\n"Story Detail"\nExtra Details:\n"Extra Detail"'
    courier_details = {
      "story_context": details,
      "courier_response": '"Courier Response"'
  }
    expect(response.body).toEqual({message: "Sending Data to prompt_admin", data: courier_details});
  });
});