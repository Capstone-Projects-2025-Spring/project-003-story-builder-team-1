const express = require('express');
const axios = require('axios');
const router = express.Router();
const userController = require('../controllers/user_controller');


router.post('/account_creation', userController.user_create_post);

router.post('/account_login', async (req, res) => {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
        return res.status(404).json({ message: "Missing required fields", data: req.body });
    }

    try {
        // Prepare data to be sent to the database
        const to_database = {
            username: username,
            password: password
        };

        // Call the database endpoint to check if the user exists
        const db_response = await axios.post('http://localhost:8080/database/login', { data: to_database });

        if (db_response.data.exists) {
            // If login is successful, return success response with user_id
            return res.status(200).json({ message: "Login successful", user_id: db_response.data.user_id });
        } else {
            // If username or password is invalid, return an error message
            return res.status(400).json({ message: "Invalid username or password" });
        }

    } catch (error) {
        console.error('Error communicating with database endpoint:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;