const router = require('express').Router();
const { createReview , getReviewsForService , getReviewById , updateReview , deleteReview } = require('../controllers/review.controller');
const auth = require('../middlewares/authMiddleWare');

router.post('/:serviceId', auth, createReview);
router.get('/:serviceId', auth, getReviewsForService);
router.get('/review/:reviewId', auth, getReviewById);
router.put('/review/:reviewId', auth, updateReview);
router.delete('/review/:reviewId', auth, deleteReview);

module.exports = router;