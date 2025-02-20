const express = require('express');
const path = require('path');
const app = express();

//Importing Libraries and File Paths
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../Frontend/public")));

//Rendering React.js Server
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/public/index.html"));
});

//Receiving and (For Now) Displaying Input from Text Box
app.post('/*', (req, res) => {
    const input = JSON.stringify(req.body);
    console.log("POST Input: " + input);
});

// Start the server
app.listen(3000, () => {
    console.log('Local Host: http://localhost:3000');
});