require('dotenv').config();

// console.log("DEBUG: Loaded MONGO_URI:", process.env.DB_URI); // Debugging line

// //Import the app configuration
const app = require('./app');
const connectDB = require('./db'); //Import db config

// //Connect to the database
connectDB();

const PORT = process.env.PORT || 8080;
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

//Start the Server
app.listen(PORT, '127.0.0.1', () => {
    console.log('Host: ' + SERVER_URL);
});