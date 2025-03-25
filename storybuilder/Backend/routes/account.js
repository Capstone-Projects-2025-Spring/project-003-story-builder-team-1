const express = require('express');
const axios = require('axios');
const router = express.Router();


router.post('/account_creation', async (req, res) => {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
        return res.status(404).json({ message: "Missing required fields", data: req.body });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: "Username must be alphanumeric" });
    }

    // Password validation (minimum 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 special character)
    const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    if (!password_regex.test(password)) {
        return res.status(400).json({ message: `Password must meet the following criteria:\n
                • At least 8 characters long\n
                • Include at least one lowercase letter\n
                • Include at least one uppercase letter\n
                • Include at least one number\n
                • Include at least one special character` });
    }

    try {
        // Check if the username already exists in the database
        const existing_user = await axios.post('http://localhost:8080/database/get_user', { username });
        if (existing_user.data.exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Prepare data to be sent to the database for account creation
        const to_database = {
            username: username,
            password: password
        };

        // Call the database endpoint to create a new user
        const db_response = await axios.post('http://localhost:8080/database/create_account', { data: to_database });

        // If account creation is successful, return success response with user_id
        return res.status(200).json({ message: "Account created successfully", user_id: db_response.data.user_id });

    } catch (error) {
        console.error('Error communicating with database endpoint:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;