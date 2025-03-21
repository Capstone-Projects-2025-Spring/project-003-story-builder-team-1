const express = require('express');
const router = express.Router();


//prompt
router.get('/app/prompt/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//refine_prompt
router.get('/app/prompt_admin/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//generate_prompt
router.get('/app/generate_prompt/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//rank_prompt
router.get('/app/rank_prompt/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

// Export the routers for use in app.js
module.exports = router;