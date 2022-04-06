const express = require('express');

const router = express.Router();

const {
  submitOrder,
  getOrderById,
  getOrdersByUser,
} = require('../controllers/orderController');

const authUser = require('../middlewares/authMiddleware');

router.post('/', authUser, submitOrder);

router.get('/:id', authUser, getOrderById);

router.get('/user/:id', authUser, getOrdersByUser);

module.exports = router;
