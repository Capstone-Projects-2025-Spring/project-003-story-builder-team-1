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
    const existing_user = await User.findOne({ username }).exec();
    if (existing_user) {
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
    const new_user = new User({ username, password });
    await new_user.save();

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
    const existing_user = await User.findOne({ username }).exec();
    
    // Check if user exists and if the password matches
    if (!existing_user || !(await bcrypt.compare(password, existing_user.password))) {
        return res.status(401).json({ error: "Invalid login credentials" });
    }

    // If credentials are correct, return the user_id
    res.status(200).json({ message: "Login successful", user_id: existing_user._id });
});

// Delete an account (user)
exports.user_delete = asyncHandler(async (req, res, next) => {
    // store info that was passed
    const { user_id } = req.params;
    const { password } = req.body;

    // looks to see if the user is within the db
    const existing_user = await User.findById(user_id);
    if (!existing_user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Check if user exists and if the password matches
    if (!(await bcrypt.compare(password, existing_user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
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
     const { user_id } = req.params
     const { password, username, new_username, new_password } = req.body;

    // checks if info for required fields was sent
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    if (!new_username && !new_password) {
        return res.status(400).json({ error: "No constant specified for update" });
    }

    // looks to see if the user is within the db
    const existing_user = await User.findById(user_id).exec();
    if (!existing_user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Check if user exists and if the password matches
    if (!(await bcrypt.compare(password, existing_user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // validates requested username
    if (new_username && new_username !== existing_user.username) {
        const existing_username = await User.findOne({ new_username }).exec();
        if (existing_username) {
            return res.status(409).json({ error: "Username already exists" });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(new_username)) {
            return res.status(400).json({ message: "Username must be alphanumeric" });
        }

        // if a username was sent to be updated then update
        existing_user.username = new_username;
    } 

    // validates password
    if (new_password) {
        // Check if the password meets the security criteria
        const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!password_regex.test(password)) {
            return res.status(400).json({ message: "Password must meet the security criteria." });
        }

        const salt = await bcrypt.genSalt(10);
        existing_user.password = await bcrypt.hash(new_password, salt);
    }

    // save to db
    await existing_user.save();
    res.status(200).json({ message: "User updated successfully", user: existing_user });
});

// Display detail page for a specific User
exports.user_details = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.user_id).populate("stories").exec();
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});