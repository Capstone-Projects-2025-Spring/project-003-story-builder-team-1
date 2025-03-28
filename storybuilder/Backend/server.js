//Import the app configuration
const app = require('./app');

const PORT = process.env.PORT || 8080;
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

//Start the Server
app.listen(PORT, '127.0.0.1', () => {
    console.log('Host: ' + SERVER_URL);
});