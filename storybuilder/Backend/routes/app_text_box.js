const express = require('express');
const router = express.Router();

//Receiving and (For Now) Displaying Input from Text Box in Console
router.post('/app/text_box/', (req, res) => {
    const input = JSON.stringify(req.body);
    console.log("POST Input: " + input);

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});
// Export the router for use in app.js
module.exports = router;