const request = require('supertest');
const app = require('../app');

//chapter_count tests
describe('POST /app/chapter_count/', () => {

  //Test Case 1: translator Successfully Receives Chapter Count
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

  //Test Case 2: translator Unsuccessfully Receive Non-Numeric Data
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

    //Test Case 3: translator Unsuccessfully Receive Chapter Count
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
      expect(response.body).toEqual({message: "Chapter Count not Received", data: input_data});
    });
});

//story_name tests
describe('POST /app/story_name/', () => {

  //Test Case 4: translator Successfully Receives Story Name
  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": "Story Name"};
    
    //Post Request
    const response = await request(app)
      .post('/app/story_name/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Story Name Received Successfully", data: input_data});
  });

  //Test Case 5: translator Unsuccessfully Receives Story Name
  it('should return 404 and an error message with the input data', async () => {
    
    //Define input data
    const input_data = {"data": null};
    
    //Post Request
    const response = await request(app)
      .post('/app/story_name/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(404);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Story Name not Received", data: input_data});
  });
});

//story_details tests
describe('POST /app/story_details/', () => {

  //Test Case 6: Story Details Successfully Receives Story Details
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

  //Test Case 7: Story Details Unsuccessfully Receives Story Details
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
    expect(response.body).toEqual({message: "Story Details not Received", data: input_data});
  });
});

//extra_details tests
describe('POST /app/extra_details/', () => {

  //Test Case 8: translator Successfully Receives Extra Details
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

  //Test Case 9: translator Unsuccessfully Receives Extra Details
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
    expect(response.body).toEqual({message: "Extra Details not Received", data: input_data});
  });
});

//courier_response tests
describe('POST /app/courier_response/', () => {

  //Test Case 10: translator Successfully Receives Courier Response
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

  //Test Case 11: translator Unsuccessfully Receives Courier Response
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
    expect(response.body).toEqual({message: "Courier Response not Received", data: input_data});
  });
});

//story tests
describe('GET /app/story/', () => {

  //Test Case 12: Sending Story Data
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
    expect(response.body).toEqual({message: "Sending Data to prompt_admin", data: details});
  });
});

//courier_data tests
describe('GET /app/courier_data/', () => {

  //Test Case 13: Sending Courier Data
  it('should return 200 and an success message with the received data', async () => {
    
    //Define input data
    const story_name_data = {"data": "Story Name"};
    const courier_data = {"data": "Courier Response"};

    //Post Request for courier_Response
    await request(app)
    .post('/app/story_name/')
    .send(story_name_data)
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
    for_frontend = {
      "title": '"Story Name"',
      "courier_response": '"Courier Response"'
  };
    expect(response.body).toEqual({message: "Sending Data to the Frontend", data: for_frontend});
  });
});