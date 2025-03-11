const express = require('express');
const router = express.Router();


//story_call
router.post('/app/story_call/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//story_push
router.post('/app/story_push/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//judge
router.get('/app/judge/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

// Export the routers for use in app.js
module.exports = router;