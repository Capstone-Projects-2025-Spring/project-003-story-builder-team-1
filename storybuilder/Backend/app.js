const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

//Importing Libraries and File Paths
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:8080', 
        'http://35.175.87.28', 
        'http://172.26.5.222', 
        'https://storybuilder-ai.space'], // Replace with the correct frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../Frontend/build')));

// Import the routes
const prompt_admin = require('./routes/prompt_admin');
const db = require('./routes/db');
const translator = require('./routes/translator');
const courier = require('./routes/courier');

// Use the imported routes
app.use('/prompt_admin', prompt_admin);
app.use('/db', db);
app.use('/translator', translator);
app.use('/courier', courier);

// Catch-all route to serve React's index.html for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
});

//Status Message to Home Page of Server
app.get('/', (req, res) => {
    res.send("Backend Server Active");
})

app.use((err, req, res, next) => {
    console.error(err.stack);

    // Handle CastError (Invalid input format)
    if (err.name === "CastError") {
        return res.status(400).json({ error: "Invalid input format" });
    }

    // Handle ValidationError (Invalid data provided)
    if (err.name === "ValidationError") {
        return res.status(400).json({ error: "Validation failed", details: err.errors });
    }

    // Handle Duplicate key error (Unique constraint violation)
    if (err.code === 11000) {
        return res.status(400).json({ error: "Duplicate key error, resource already exists" });
    }

    // Handle server selection errors (MongoDB server issues)
    if (err.name === "MongooseServerSelectionError") {
        return res.status(503).json({ error: "Service unavailable, could not connect to database" });
    }

    // Handle DocumentNotFoundError (Document not found)
    if (err.name === "DocumentNotFoundError") {
        return res.status(404).json({ error: "Document not found" });
    }

    // Generic 500 for all other errors
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message
    });
});

// Export the app to be used in the server.js
module.exports = app;
