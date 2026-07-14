const express=require("express")
const authRoutes=require('./routes/authRoutes')
const app=express()
const cors=require('cors')
const cookieParser = require('cookie-parser');
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONT_END_URI,
  credentials: true
}));
app.use('/api/auth',authRoutes);
app.use('/api/course',require('./routes/courseRoutes'))
module.exports=app