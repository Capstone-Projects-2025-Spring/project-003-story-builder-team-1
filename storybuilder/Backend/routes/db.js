const express = require('express');
const router = express.Router();

//grab
router.get('/app/grab/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//account
router.get('/app/account/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//agent
router.get('/app/agent/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//new_account
router.post('/app/new_account/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//new_agent
router.post('/app/new_agent/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//agent_breakdown
router.get('/app/agent_breakdown/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

// Export the routers for use in app.js
module.exports = router;