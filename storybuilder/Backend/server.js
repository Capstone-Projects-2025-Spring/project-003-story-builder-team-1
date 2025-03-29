require('dotenv').config();

console.log("DEBUG: Loaded MONGO_URI:", process.env.MONGO_URI); // Debugging line

//Import the app configuration
const app = require('./app');
const connectDB = require('./db'); //Import db config

//Connect to the database
connectDB();

//Start the Server
app.listen(8080, () => {
    console.log('Local Host: http://localhost:8080/');
});