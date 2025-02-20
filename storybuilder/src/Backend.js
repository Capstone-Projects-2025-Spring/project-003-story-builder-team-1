const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var datum = null;

app.get('/', (req, res) => {
    const query = req.query;
    console.log('Raw GET data:' + query.data);
    console.log('Raw GET message:' + query.message);

    var data_output = query.data.replace("Input", "Output");
    var message_output = query.message.replace("Input", "Output");
    res.send(data_output + " " + message_output);
})

app.post('/post', (req, res) => {
    const input = req.body;
    datum = input.data;
    console.log("POST Input: " + JSON.stringify(input));
    res.send("Input Received: " + JSON.stringify(input));
})

app.get('/post', (req, res) => {
    res.send("POST Data: " + datum);
    res.send();
})

// Start the server
app.listen(3000, () => {
    console.log('GET: http://localhost:3000');
    console.log('POST: http://localhost:3000/post');
});