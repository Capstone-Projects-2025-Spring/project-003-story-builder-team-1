//Import the app configuration
const app = require('./app');
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the correct frontend URL
    credentials: true,               // Allow cookies, authorization headers, etc.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
//Start the Server
app.listen(8080, () => {
    console.log('Local Host: http://localhost:8080/');
});