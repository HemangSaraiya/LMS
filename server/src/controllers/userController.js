const userModel=require('../models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const Email=require('../middlewares/email')
const getCookieOptions = () => ({
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
})

async function signup(req,res){
    const {username,email,password}=req.body;
    const isUserExists=await userModel.findOne({
        email
    })
    if(isUserExists){
        return res.status(409).json({
            message:"User already exists"
        })
    }
    const hash=await bcrypt.hash(password,10)
    const verificationCode=Math.floor(100000+Math.random()*900000).toString();
    const user=await userModel.create({
        username,
        email,
        password:hash,
        verificationCode
    })
    Email.VerificationEmail(user.email,verificationCode)
    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET)
    res.cookie('token', token, getCookieOptions())
    res.status(201).json(user)
}

async function verifyEmail(req,res){
    try{
        const {code}=req.body
        if(!code){
            return res.status(400).json({
                message:"Verification code is required"
            })
        }
        const user=await userModel.findOne({
            verificationCode:code
        })
        if(!user){
            return res.status(400).json({
                message:"Invalid or Expire Verification Code"
            })
        }
        user.isVerified=true
        user.verificationCode=undefined
        user.createdAt=undefined
        await user.save();
        return res.status(200).json({
            message:"Verified"
        })
    }
    catch(e){
        console.log("error in verifyemail",e);
        return res.status(500).json({
            message:"Server error during verification"
        })
    }
}

async function login(req,res){
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"Email and password are required"
        })
    }
    const user=await userModel.findOne({
        email
    })
    if(!user ){
        return res.status(400).json({
            message:"User Not Found"
        })
    }
    if(!user.isVerified){
        return res.status(400).json({
            message:"Email not verified"
        })
    }
    const passmatch=await bcrypt.compare(password,user.password)
    if(!passmatch){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }
    Email.welcomeEmail(user.email,user.username);
    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET)
    res.cookie('token', token, getCookieOptions())
    res.status(201).json(user)
}

async function logout(req,res){
    res.clearCookie('token', getCookieOptions())
    res.status(200).json({
        message:"User Logged out"
    })
}

async function getUsers(req,res){
    try{
        const users=await userModel.find()
        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

async function deleteUser(req,res){
    try{
        const userId=req.params.id;
        const user=await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        if(user.role==="admin"){
            return res.status(403).json({
                message:"Admin user cannot be deleted"
            })
        }
        await userModel.findByIdAndDelete(userId)
        res.status(200).json({
            message:"User deleted successfully"
        })
    }
    catch(err){
        console.error(err)
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

module.exports={signup,verifyEmail,login,logout,getUsers,deleteUser}