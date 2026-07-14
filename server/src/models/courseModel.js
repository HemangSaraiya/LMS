const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true
  },
  lectures:[
    {
      title:{
        type:String,
        required:true},
      description:{
        type:String,
        required:true},
      video:{
        type:String,
        required:true
      }
    }
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth"
    }
  ]
}, { timestamps: true });

const courseModel = mongoose.model("course", courseSchema);

module.exports = courseModel;