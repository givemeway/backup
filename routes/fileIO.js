const express = require('express');
const router = express.Router();
const sqlite = require("sqlite3");
const {verifyToken} = require("../auth/auth");
const {createDir} = require("../controllers/createFilePath")

// https://www.turing.com/kb/build-secure-rest-api-in-nodejs

router.post("/sendFileInfo",verifyToken,createDir,(req,res,next)=>{
     console.log(req.body);
     res.json("file info received");
});

router.post("/receiveFile",(req,res)=>{
    console.log(req.headers);
    console.log(req)
    res.json("file receiving");
});


module.exports = router; 