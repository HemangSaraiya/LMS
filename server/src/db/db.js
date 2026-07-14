const mongoose=require('mongoose')

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database is connected")
    }
    catch(e){
        console.log("db error",e);
    }
}
module.exports=connectDB