const jwt = require('jsonwebtoken')
const crypto = require('crypto');


//use this method to create secret token
const generateAccessTokenSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

// console.log(generateAccessTokenSecret())

const generateAccessToken= (user)=>{
    return jwt.sign({userId:user.id}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30d'})
}

const generateRefreshToken = (user)=>{
    return jwt.sign({userId: user.id}, process.env.REFRESH_TOKEN_SECRET)
}

const verifyAccessToken = (req,res,next)=>{
    const authHeader= req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message:'no access token provide'})
    }

    const accessToken = authHeader.split(' ')[1];
    try {

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        next()

    }catch(error){
        console.log(error)
        res.status(403).json({message:'Invalid access token'})

    }

}

module.exports={
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken
}

