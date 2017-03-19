const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const ContactController = require('../controllers/contact_controller');
const RequestController = require('../controllers/request_controller');
const SignupController = require('../controllers/signup_controller');
const LoginController = require('../controllers/login_controller');
const ForgotPWDController = require('../controllers/forgotpwd_controller');
const ResetPWDController = require('../controllers/resetpwd_controller');
const ProfileController = require('../controllers/profile_controller');
const MemberController = require('../controllers/member_controller');
const PhotoController = require('../controllers/photo_controller');
const GalleryController = require('../controllers/gallery_controller');
const BlogController = require('../controllers/blog_controller');
const ChatController = require('../controllers/chat_controller');

var protect = function(req, res, next) {
   if(req.user) {
     next();
   } else {
     res.redirect('/login');
   }
}

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { index_active: 'true' });
});

router.get('/index', (req, res) => {
  res.render('index', { index_active: 'true' });
});

router.get('/contact', ContactController.index);
router.post("/contact", ContactController.create);
router.get('/request', RequestController.index);
router.get('/signup', SignupController.index);
router.post("/signup", upload.single('profileimage'), SignupController.create);
router.get('/login', LoginController.index);
router.post("/login", LoginController.authenticate);
router.get('/forgot', ForgotPWDController.index);
router.post('/forgot', ForgotPWDController.create);
router.get('/reset', ResetPWDController.index);
router.get('/reset/:token', ResetPWDController.index);
router.post('/reset/:token', ResetPWDController.create);
router.post('/reset', ResetPWDController.create);
router.get('/profile', protect, ProfileController.index);
router.post('/profileupdate', protect, upload.single('profileimage'), ProfileController.update);
router.get('/member', protect, MemberController.index);
router.get('/photoupload', protect, PhotoController.index);
router.post("/photoupload", protect, upload.single('profileimage'), PhotoController.create);
router.get('/gallery', protect, GalleryController.index);
router.get('/blog', protect, BlogController.index);
router.post('/blogupload', protect, upload.single('profileimage'), BlogController.create);
router.post('/commentupload', protect, BlogController.createComment);
router.get('/deleteblog/:id', protect, BlogController.deleteBlog);
router.get('/deletephoto/:id', protect, GalleryController.deletePhoto);
router.get('/chat', protect, ChatController.index);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

LoginController.init();

module.exports = router;