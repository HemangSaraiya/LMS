const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        default:"student",
        enum:["student", "instructor", "admin"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationCode:String,
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60 * 30
    }
})

const userModel=mongoose.model("auth",userSchema)


module.exports=userModel