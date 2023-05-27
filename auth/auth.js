const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (request,response,next) =>{
    const authHeader = request.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token,process.env.JWT,(error,user)=>{
            if(error) response.status(403).json("Token Invalid");
            request.user = user;
            next();
        });
    }else{
        return response.status(401).json("You are not authenticated");
    }

};

module.exports = {verifyToken};