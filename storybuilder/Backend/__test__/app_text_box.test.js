const request = require('supertest');
const app = require('../app');

//app_text_box route tests
describe('POST /app/text_box/', () => {
  //test case 1: should receive input and return success message
  it('should return 200 and a success message with the input data', async () => {
    //Define input data
    const inputData = { text: 'Sample text' };
    //Post Request
    const response = await request(app)
      .post('/app/text_box/')
      .send(inputData)
      .expect('Content-Type', /json/)
      .expect(200);

    //assert response matches expected output
    expect(response.body).toEqual({
      message: "Data Received Successfully",
      data: inputData
    });
  });
});