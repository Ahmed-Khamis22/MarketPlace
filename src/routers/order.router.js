const router = require('express').Router();
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, updateOrderStatus  } = require('../controllers/order.controller');
const auth = require('../middlewares/authMiddleWare');

router.post('/:serviceId', auth, createOrder);
router.get('/', auth, getAllOrders);
router.get('/:orderId', auth, getOrderById);
router.put('/:orderId', auth, updateOrder);
router.delete('/:orderId', auth, deleteOrder);
router.put('/:orderId/status', auth, updateOrderStatus);

module.exports = router;