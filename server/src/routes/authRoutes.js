const authController=require('../controllers/userController')
const courseController=require('../controllers/courseController')
const express=require('express')
const authMiddleware=require('../middlewares/userMiddleware')
const router=express.Router()

router.post('/signup',authController.signup);
router.post('/verifyemail',authController.verifyEmail);
router.post('/login',authController.login);
router.post('/logout',authController.logout);
router.get('/me',authMiddleware.verifyToken,(req,res)=>{
res.json({
    user:req.user
})
});
router.get("/admin-test",authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  res.json({ message: "Admin working ✅" });
});
router.get("/instructor-test",authMiddleware.verifyToken, authMiddleware.isInstructor, (req, res) => {
  res.json({ message: "Instructor working ✅" });
});
router.get("/my-courses",authMiddleware.verifyToken, authMiddleware.isInstructor, courseController.getInstructorCourses);

router.get('/getUsers',authController.getUsers);
router.delete('/deleteUser/:id',authController.deleteUser);

module.exports=router;

