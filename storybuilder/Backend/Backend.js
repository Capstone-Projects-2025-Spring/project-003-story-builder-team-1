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

//Status Message to Home Page of Server
app.get('/', (req, res) => {
    res.send("Backend Server Active");
})

//Receiving and (For Now) Displaying Input from Text Box in Console
app.post('/api/text_box/', (req, res) => {
    const input = JSON.stringify(req.body);
    console.log("POST Input: " + input);
});

//Start the Server
app.listen(8080, () => {
    console.log('Local Host: http://localhost:8080/');
});