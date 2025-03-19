const request = require('supertest');
const app = require('../app');

//story_contents tests
describe('POST /app/story_contents/', () => {

  //Test Case 1: translator Successfully Receives Story Data
  it('should return 200 and a success message with the input data', async () => {
    
    //Define input data
    const input_data = {
      "chapter_count": 10,
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail"
    };
    
    //Post Request
    const response = await request(app)
      .post('/app/story_contents/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Story Contents Received Successfully", data: input_data});
  });

  //Test Case 2: translator Unsuccessfully Receive Non-Numeric Data for chapter_count
  it('should return 400 and an error message with the input data', async () => {
    
    //Define input data
    const input_data = {
      "chapter_count": "Test",
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail"
    };
    
    //Post Request
    const response = await request(app)
      .post('/app/story_contents/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(400);

    //assert response matches expected output
    expect(response.body).toEqual({message: "Invalid Data Type", data: input_data});
  });

    //Test Case 3: translator Unsuccessfully Receive Chapter Count
    it('should return 404 and an error message with the input data', async () => {
    
      //Define input data
      const input_data = {
        "chapter_count": 10,
        "story_name": null,
        "story_details": "Story Detail",
        "extra_details": "Extra Detail"
      };
      
      //Post Request
      const response = await request(app)
        .post('/app/story_contents/')
        .send(input_data)
        .expect('Content-Type', /json/)
        .expect(404);
  
      //assert response matches expected output
      expect(response.body).toEqual({message: "Story Contents not Received", data: input_data});
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
    const input_data = {
      "chapter_count": 10,
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail"
    };

    //Post Request for Data
    await request(app)
      .post('/app/story_contents/')
      .send(input_data)
      .expect('Content-Type', /json/)
      .expect(200);

    //Get Request for test_send
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

  //Test Case 13: Sending Courier Data
  it('should return 200 and an success message with the received data', async () => {
    
    //Define input data
    const input_data = {
      "chapter_count": 10,
      "story_name": "Story Name",
      "story_details": "Story Detail",
      "extra_details": "Extra Detail"
    };
    const courier_data = {"data": "Courier Response"};

    //Post Request for Data
    await request(app)
      .post('/app/story_contents/')
      .send(input_data)
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