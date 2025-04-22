const User = require("../models/user");
const Story = require("../models/story");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Creates an account (user)
exports.create_user = asyncHandler(async (req, res, next) => {
    // store info that was passed
    const { username, password } = req.body;

    // checks if info for required fields was sent
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // checks to see if the username is taken
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ error: "Username must be alphanumeric" });
    }

    // Password validation (minimum 8 characters, etc.)
    const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!password_regex.test(password)) {
        return res.status(400).json({ error: "Password must meet the security criteria." });
    }
    
    //creates an account
    const newUser = new User({ username, password });
    await newUser.save();

    //returns successfull message
    res.status(201).json({ message: "Account created successfully" });
});

// Checks login credentials of user
exports.user_login = asyncHandler(async (req, res, next) => {
    // store info that was passed
    const { username, password } = req.body;

    // checks if info for required fields was sent
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    //checks the db to see if username exists
    const existingUser = await User.findOne({ username }).exec();
    
    // Check if user exists and if the password matches
    if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    // If credentials are correct, return the user_id
    res.status(200).json({ message: "Login successful", user_id: existingUser._id });
});

// Delete an account (user)
exports.user_delete = asyncHandler(async (req, res, next) => {
    // store info that was passed
    const { user_id } = req.params;

    // looks to see if the user is within the db
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    try {
        // 1. Delete all the user's stories first
        await Story.deleteMany({ user: user_id });

        // 2. Then delete the user
        await User.findByIdAndDelete(user_id);

        // Send a successful response
        return res.status(200).json({ message: "User and their stories deleted successfully" });
    } catch (err) {
        // Handle errors if the deletion fails
        return res.status(500).json({ error: "Something went wrong during deletion" });
    }

});

// Updates user
exports.user_update = asyncHandler(async (req, res, next) => {
     // store info that was passed
    const { username, password } = req.body;

    // checks if info for required fields was sent
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // looks to see if the user is within the db
    const user = await User.findById(req.params.user_id).exec();
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // validates requested username
    if (username) {
        const existingUser = await User.findOne({ username }).exec();
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: "Username must be alphanumeric" });
        }
    }

    // validates password
    if (password) {
        // Check if the password meets the security criteria
        const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!password_regex.test(password)) {
            return res.status(400).json({ message: "Password must meet the security criteria." });
        }
    }

    // if a username was sent to be updated then update
    if (username) user.username = username;
    
    // if a password was sent to be updated then update
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }
    
    // save to db
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
});

// Display detail page for a specific User
exports.user_details = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.user_id).populate("stories").exec();
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});