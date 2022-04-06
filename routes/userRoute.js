const express = require('express');
const router = express.Router();

const authUser = require('../middlewares/authMiddleware');

const {
  login,
  register,
  getUserProfileById,
  updateUserProfile,
  verifyEmail,
} = require('../controllers/userController');

const {
  registerValidationMiddleware,
} = require('../middlewares/validationMiddlewares/userValidationMiddleware');

router.post('/login', login);

router.post('/register', registerValidationMiddleware, register);

router.get('/emailVerification/:id', verifyEmail);

router
  .route('/profile/:id')
  .get(authUser, getUserProfileById)
  .put(authUser, updateUserProfile);

module.exports = router;
