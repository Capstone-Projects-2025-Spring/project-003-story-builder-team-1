const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const query = req.query;
    console.log('Received GET data:', query);
    const obj = JSON.parse(query);
    console.log(obj.data);
  })

// Start the server
app.listen(3000, () => {
    console.log('Server: http://localhost:3000?data=5');
});