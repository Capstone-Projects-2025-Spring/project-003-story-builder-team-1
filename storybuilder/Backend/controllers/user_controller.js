const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Display list of all Users
exports.user_list = asyncHandler(async (req, res, next) => {
    const users = await User.find().select("username stories").populate("stories").exec();
    res.json(users);
});

// Display detail page for a specific User
exports.user_detail = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("stories").exec();
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});

// Handle User create on POST
exports.user_create_post = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
});

// Handle User delete on POST
exports.user_delete_post = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
});

// Handle User update on POST
exports.user_update_post = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findById(req.params.id).exec();
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
});
