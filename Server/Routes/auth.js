const express = require('express');
const router = express.Router();

const { register, login, saveRefreshToken, midelWare, loginSystem } = require('../Controllers/User');


router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', saveRefreshToken);
router.get('/me', midelWare, loginSystem);
module.exports = router;