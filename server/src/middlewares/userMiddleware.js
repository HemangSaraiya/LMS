const jwt=require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Access Denied"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(e){
        res.status(401).json({
            message:"Invalid Token"
        })
    }
}

const isAdmin=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(403).json({
            message:"Access Denied"
        })
    }
    next();
}

const isInstructor=(req,res,next)=>{
    if(req.user.role!=="instructor" && req.user.role!=="admin"){
        return res.status(403).json({
            message:"Access Denied"
        })
    }
    next();
}

module.exports={verifyToken, isAdmin, isInstructor};