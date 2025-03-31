const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

//Importing Libraries and File Paths
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:3000' ,'http://localhost:8080', 'http://35.175.87.28', 'http://172.26.5.222'], // Replace with the correct frontend URL
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
const account = require('./routes/account');

// Use the imported routes
app.use('/prompt_admin', prompt_admin);
app.use('/db', db);
app.use('/translator', translator);
app.use('/courier', courier);
app.use('/account', account);

// Catch-all route to serve React's index.html for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
});

//Status Message to Home Page of Server
app.get('/', (req, res) => {
    res.send("Backend Server Active");
})

// Export the app to be used in the server.js
module.exports = app;
