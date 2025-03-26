const mongoose = require('mongoose')


const DB_URI = 'mongodb+srv://yousufqari:greenblue2025@cluster0.dzlzu.mongodb.net/StoryBuilder?retryWrites=true&w=majority&appName=Cluster0';

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