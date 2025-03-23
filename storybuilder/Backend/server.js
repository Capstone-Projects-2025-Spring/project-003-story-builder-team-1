//Import the app configuration
const app = require('./app');

//Start the Server
app.listen(8080, () => {
    console.log('Local Host: http://localhost:8080/');
});