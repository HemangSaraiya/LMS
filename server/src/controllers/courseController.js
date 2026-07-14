const courseModel = require("../models/courseModel")
const cloudinary = require("../utils/cloudinary")

const extractPublicIdFromUrl = (url) => {
  if (!url) return ""

  try {
    const parsedUrl = new URL(url)
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean)
    const uploadIndex = pathParts.indexOf("upload")

    if (uploadIndex === -1) return ""

    const relevantParts = [...pathParts.slice(uploadIndex + 1)]

    if (relevantParts[0]?.startsWith("v") && /^\d+$/.test(relevantParts[0])) {
      relevantParts.shift()
    }

    if (relevantParts.length === 0) return ""

    const lastPartIndex = relevantParts.length - 1
    relevantParts[lastPartIndex] = relevantParts[lastPartIndex].replace(/\.[^/.]+$/, "")

    return relevantParts.join("/")
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error.message)
    return ""
  }
}

const deleteFromCloudinary = async (url, resourceType = "image") => {
  if (!url) return

  try {
    const publicId = extractPublicIdFromUrl(url)
    if (!publicId) return

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error.message)
  }
}

const uploadToCloudinary = async (file, resourceType = "image") => {
  if (!file) return ""

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "courses" },
      (error, uploadedFile) => {
        if (error) reject(error)
        else resolve(uploadedFile)
      }
    )

    stream.end(file.buffer)
  })

  return result.secure_url
}

const createCourse = async (req, res) => {
  try {
    const { title, description, price, lectures } = req.body
    const imageFile = req.files?.image?.[0]
    const lectureFiles = req.files?.lectureVideos || []

    let imageUrl = ""
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile, "image")
    }

    let parsedLectures = []
    if (lectures) {
      parsedLectures = typeof lectures === "string" ? JSON.parse(lectures) : lectures
    }

    const lectureUploads = await Promise.all(
      parsedLectures.map(async (lecture, index) => {
        const matchingFile = lectureFiles[index]
        let videoUrl = lecture.video || ""

        if (matchingFile) {
          videoUrl = await uploadToCloudinary(matchingFile, "video")
        }

        return {
          title: lecture.title,
          description: lecture.description,
          video: videoUrl
        }
      })
    )

    const course = await courseModel.create({
      image: imageUrl,
      title,
      description,
      price,
      lectures: lectureUploads,
      instructor: req.user.id
    })

    res.status(201).json(course)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error creating course", error: error.message })
  }
}

const getAllCourses = async (req, res) => {
 
  try{
    const page=parseInt(req.query.page)||1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ]
        }
      : {};
      const courses = await courseModel
      .find(query)
      .populate("instructor", "username email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCourses = await courseModel.countDocuments(query);

    res.status(200).json({
      courses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses=await courseModel.find({ instructor: instructorId });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching instructor courses" });
  } 
};

const getStudentCourses=async (req,res)=>{
  try {
    const StudentId = req.user.id;
    const courses=await courseModel.find({
      $or:[
      { students: StudentId },
      {instructor:StudentId}
      ]
  }).populate('instructor', 'username email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching instructor courses" });
  } 
}

const deleteCourse=async(req,res)=>{
  try{
    const courseid=req.params.id;
    const course=await courseModel.findById(courseid);
    if(!course){
      return res.status(404).json({message:"Course not found"})
    }

    if (course.image) {
      await deleteFromCloudinary(course.image, "image")
    }

    if (Array.isArray(course.lectures)) {
      for (const lecture of course.lectures) {
        if (lecture?.video) {
          await deleteFromCloudinary(lecture.video, "video")
        }
      }
    }

    await courseModel.findByIdAndDelete(courseid);
    res.status(200).json({message:"Course deleted successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error deleting course" });
  }
}

const buyCourse=async(req,res)=>{
  try{
    const courseid=req.params.id;
    const course=await courseModel.findById(courseid);
    if(!course){
      return res.status(404).json({message:"Course not found"})
    }
    const alreadyBought = course.students?.some(student => {
      const studentId = student?._id ? student._id.toString() : student?.toString();
      return studentId === req.user.id;
    });
    if(alreadyBought){
      return res.status(400).json({message:"You have already bought this course"})
    }
    course.students.push(req.user.id);
    await course.save();
    res.status(200).json({message:"Course bought successfully"});
  }
  catch(error){
    res.status(500).json({ message: "Error buying course" });
  }
}

const viewCourse=async(req,res)=>{
  try{
    const courseid=req.params.id;
    const course=await courseModel.findById(courseid).populate('instructor', 'username email').populate('students', 'username email');
    if(!course){
      return res.status(404).json({message:"Course not found"})
    }
    const isStudent = course.students?.some(student => {
      const studentId = student?._id ? student._id.toString() : student?.toString();
      return studentId === req.user.id;
    });

    const instructorId = typeof course.instructor === 'object'
      ? course.instructor?._id?.toString() || course.instructor?.toString()
      : course.instructor?.toString();

    const isInstructor = instructorId === req.user.id;

    if(!isStudent && !isInstructor){
      return res.status(403).json({ message: "You must buy this course to view it" });
    }
    res.status(200).json(course);
  }
  catch(error){
    res.status(500).json({ message: "Error viewing course" });
  }
}

const updateCourse=async(req,res)=>{
  try{
    const courseid=req.params.id
    const course=await courseModel.findById(courseid);
    if(!course){
      return res.status(404).json({message:"Course not found"})
    }

    const { title, description, price, lectures } = req.body
    const imageFile = req.files?.image?.[0]
    const lectureFiles = req.files?.lectureVideos || []

    // Update basic fields
    let updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (price) updateData.price = price

    // Handle image update
    if (imageFile) {
      if (course.image) {
        await deleteFromCloudinary(course.image, "image")
      }
      updateData.image = await uploadToCloudinary(imageFile, "image")
    }

    // Handle lectures update
    if (lectures) {
      let parsedLectures = typeof lectures === "string" ? JSON.parse(lectures) : lectures
      
      const lectureUploads = await Promise.all(
        parsedLectures.map(async (lecture, index) => {
          const matchingFile = lectureFiles[index]
          let videoUrl = lecture.video || ""

          if (matchingFile) {
            // If there's an old video, delete it
            if (lecture.video) {
              await deleteFromCloudinary(lecture.video, "video")
            }
            videoUrl = await uploadToCloudinary(matchingFile, "video")
          }

          return {
            title: lecture.title,
            description: lecture.description,
            video: videoUrl
          }
        })
      )

      updateData.lectures = lectureUploads
    }

    const updatedCourse = await courseModel.findByIdAndUpdate(courseid, updateData, { new: true });
    res.status(200).json(updatedCourse); 
  }
  catch(error){
    console.error(error)
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
}

const searchCourses= async(req,res)=>{
  try{
    const courses=await courseModel.find({
      $or:[
        {title:{$regex:req.params.key,$options:"i"}},
        {description:{$regex:req.params.key,$options:"i"}}
      ]
    }).populate('instructor', 'username email');
    res.status(200).json(courses);
  }
  catch(err){
    console.error(err)
    res.status(500).json({ message: "Error searching courses", error: err.message });
  }
}



module.exports = { createCourse, getAllCourses, getInstructorCourses,getStudentCourses, deleteCourse, buyCourse, viewCourse, updateCourse, searchCourses };