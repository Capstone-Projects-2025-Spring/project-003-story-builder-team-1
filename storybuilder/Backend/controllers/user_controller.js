const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Handle User create on POST
exports.user_create_post = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ error: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: "Username must be alphanumeric" });
    }

    // Password validation (minimum 8 characters, etc.)
    const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!password_regex.test(password)) {
        return res.status(400).json({ message: "Password must meet the security criteria." });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(200).json({ message: "Account created successfully" });
});

// Handle User login on POST
exports.user_login_post = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ error: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username }).exec();
    
    // Check if user exists and if the password matches
    if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        return res.status(400).json({ error: "Invalid username or password" });
    }

    // If credentials are correct, return the user_id
    res.status(200).json({ message: "Login successful", user_id: existingUser._id });
});

// Delete a user
exports.user_delete_post = asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;

    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // 1. Delete all the user's stories first
    await Story.deleteMany({ user: user_id });

    // 2. Then delete the user
    await User.findByIdAndDelete(user_id);

    res.json({ message: "User and their stories deleted successfully" });
});

// Handle User update on POST
exports.user_update_post = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findById(req.params.user_id).exec();
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (username) {
        const existingUser = await User.findOne({ username }).exec();
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: "Username must be alphanumeric" });
        }
    }

    if (password) {
        // Check if the password meets the security criteria
        const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!password_regex.test(password)) {
            return res.status(400).json({ message: "Password must meet the security criteria." });
        }
    }

    if (username) user.username = username;
    
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
});

// Display detail page for a specific User
exports.user_details = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.user_id).populate("stories").exec();
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});