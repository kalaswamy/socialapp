const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const ContactController = require('../controllers/contact_controller');
const RequestController = require('../controllers/request_controller');
const SignupController = require('../controllers/signup_controller');

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

router.get('/login', (req, res) => {
  res.render('login', { login_active: 'true' });
});

router.post("/login", (req, res) => {
    res.redirect('/index');
});

module.exports = router;