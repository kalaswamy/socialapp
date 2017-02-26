const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const ContactController = require('../controllers/contact_controller');
const RequestController = require('../controllers/request_controller');
const SignupController = require('../controllers/signup_controller');
const LoginController = require('../controllers/login_controller');
const ProfileController = require('../controllers/profile_controller');


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
router.get('/profile', ProfileController.index);
router.post('/profileupdate', upload.single('profileimage'), ProfileController.update);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

LoginController.init();

module.exports = router;