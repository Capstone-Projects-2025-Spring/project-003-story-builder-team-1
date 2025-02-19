const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const query = req.query;
    console.log('Received GET data:', query.data);
    var output = query.data.replace("Input", "Output");
    res.send(output);
  })

// Start the server
app.listen(3000, () => {
    console.log('Server: http://localhost:3000?data=This_Is_Input');
});