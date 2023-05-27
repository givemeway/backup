const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/",(req,res)=>{
    const encodedString = req.headers.authorization;
    const extractedUsernamePassword = atob(encodedString.split(" ")[1]);
    const username = extractedUsernamePassword.split(":")[0];
    const password = extractedUsernamePassword.split(":")[1];
    // TODO
    // 1. Validate the given username and password
    const payload = {Username: username,Password: password}
    const token = jwt.sign(payload,process.env.JWT,{expiresIn:86400 });
    res.status(200).json({user:{token}});
    // 2. Invalid credentials. Return status 401
});

module.exports = router; 