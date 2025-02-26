const express = require('express');
const path = require('path');
const app = express();

//Importing Libraries and File Paths
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS Policy Handling
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Import the routes
const api_text_box = require('./routes/api_text_box');

// Use the imported routes
app.use(api_text_box);

//Status Message to Home Page of Server
app.get('/', (req, res) => {
    res.send("Backend Server Active");
})

// Export the app to be used in the server.js
module.exports = app;
