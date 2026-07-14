const express=require('express')
const courseController=require('../controllers/courseController')
const authMiddleware=require('../middlewares/userMiddleware')
const uploadMiddleware=require('../middlewares/uploadMiddleware')
const router=express.Router()

router.post('/createcourse', authMiddleware.verifyToken, authMiddleware.isInstructor, uploadMiddleware.fields([
  { name: 'image', maxCount: 1 },
  { name: 'lectureVideos', maxCount: 20 }
]), courseController.createCourse)
router.get('/courses', courseController.getAllCourses)
router.delete('/deletecourse/:id', authMiddleware.verifyToken, authMiddleware.isInstructor, courseController.deleteCourse)
router.post('/buycourse/:id', authMiddleware.verifyToken, courseController.buyCourse)
router.get('/viewcourse/:id', authMiddleware.verifyToken, courseController.viewCourse)
router.put('/updatecourse/:id', authMiddleware.verifyToken, authMiddleware.isInstructor, uploadMiddleware.fields([
  { name: 'image', maxCount: 1 },
  { name: 'lectureVideos', maxCount: 20 }
]), courseController.updateCourse)
// router.get('/search/:key', courseController.searchCourses)
router.get('/studentcourses',authMiddleware.verifyToken,courseController.getStudentCourses)
module.exports=router