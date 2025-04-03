require('dotenv').config();

console.log("DEBUG: Loaded MONGO_URI:", process.env.MONGO_URI); // Debugging line

//Import the app configuration
const app = require('./app');
//const connectDB = require('./db'); //Import db config

//Connect to the database
//connectDB();

const PORT = process.env.PORT || 8080;
const HOST = process.env.DOCKER_HOST || "0.0.0.0";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";
console.log("SERVER_URL:", SERVER_URL); // Debugging line

//Start the Server
app.listen(PORT, HOST, () => {
    console.log('Host: ' + HOST);
});