const mongoose = require('mongoose')
require('dotenv').config();

const DB_URI = process.env.DB_URI;

if (!DB_URI) {
    console.error('MongoDB URI is undefined. Check your .env file.');
    process.exit(1);
}

console.log("MongoDB URI:", DB_URI);

//connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB (StoryBuilder Database)');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;