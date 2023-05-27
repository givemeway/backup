const {Router} = require('express');
const router = Router();
const path = require("path");
const fs = require("fs");

const createDir = async (req,res,next)=>{
    // TODO
    // 1. read params.
    //      a) Authorize the token or API key - done
    // 2. extract the machine name, file metaData[ filePath, fileHash, size]
    // 3. Create the path directory in the Machine Name
    // 4. Send the Signal Ready
    const dir = req.body.dir
    const fileName = req.body.fileName;
    const deviceName = req.body.deviceName;
    const fileAbsPath = path.join(deviceName,dir,fileName);
    fs.access(fileAbsPath,(err)=>{
        if(err){
            fs.mkdir(path.dirname(fileAbsPath),{recursive: true},(error)=>{
                if(error){
                    console.log(error)
                }else{
                    console.log("new director created1")
                }
            });
        }else{
            console.log("give directory already exists")
        }
    });
    next();
    
}

module.exports = {createDir};


