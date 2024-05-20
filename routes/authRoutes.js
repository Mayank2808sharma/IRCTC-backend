const express = require('express');
const { registerUser, loginUser, changeUserPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', changeUserPassword);

module.exports = router;
