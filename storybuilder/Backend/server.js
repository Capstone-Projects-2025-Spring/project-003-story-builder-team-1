//Import the app configuration
const app = require('./app');

const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

//Start the Server
app.listen(8080, '0.0.0.0', () => {
    console.log('Host: ' + SERVER_URL);
});