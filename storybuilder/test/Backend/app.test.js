const request = require('supertest');
const app = require('../../Backend/app')
const api_text_box_route = require('../../Backend/routes/api_text_box');

app.use('api_text_box', api_text_box_route)

//api_test_block route tests
describe('POST /api/text_box/', () => {
    //test case 1: should receive input and return success message
    it('should receive input and return success message', async () => {
        //Define input data
        const input_data = { text: "Test Input" };

        //Post Request
        const response = await request(app)
            .post('/api/text_box/')
            .send(input_data)
            .expect('Content-Type', /json/)
            .expect(200);
        
        //assert response matches expected output
        //The route provides this message if successful
        expect(response.body).toEqual({
            //message to check
            message: "Data Received Successfully",
            //data to check
            data: input_data
        });
    });
});