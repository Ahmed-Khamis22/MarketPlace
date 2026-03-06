const Review = require('../models/Reviews').Review;
const Service = require('../models/Service').Service;
const asyncHandler = require('express-async-handler');

// Create a new review
const createReview = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;

    const cleanReview = (review || "").trim();

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
        res.status(400);
        throw new Error("Rating must be a number between 1 and 5");
    }

    const service = await Service.findById(serviceId);

    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    const existingReview = await Review.findOne({ serviceId, userId });

    if (existingReview) {
        res.status(400);
        throw new Error("You have already reviewed this service");
    }

    const newReview = await Review.create({
        serviceId,
        userId,
        rating: numericRating,
        review: cleanReview,
    });

    res.status(201).json({
        success: true,
        review: {
            _id: newReview._id,
            serviceId: newReview.serviceId,
            userId: newReview.userId,
            rating: newReview.rating,
            review: newReview.review,
            createdAt: newReview.createdAt,
        },
    });
});

const getReviewsForService = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    const reviews = await Review.find({ serviceId }).populate('userId', 'name').populate('serviceId', 'title').skip(skip).limit(limit);
    res.json({
        success: true,
        reviews: reviews.map(r => ({
            _id: r._id,
            user: r.userId.name,
            rating: r.rating,
            review: r.review,
            createdAt: r.createdAt,
        })),
    });
});

const getReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('userId', 'name').populate('serviceId', 'title');
    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }
    res.json({
        success: true,
        review,
    });
});

const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;
  const { rating, review } = req.body;

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error("Rating must be a number between 1 and 5");
  }

  const cleanReview = (review || "").trim();
  if (!cleanReview) {
    res.status(400);
    throw new Error("Review text is required");
  }

  const updated = await Review.findOneAndUpdate(
    { _id: reviewId, userId },
    { rating: numericRating, review: cleanReview },
    { new: true }
  );

  if (!updated) {
    res.status(404);
    throw new Error("Review not found or unauthorized");
  }

  res.json({ success: true, review: updated });
});

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;    
    const deleted = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!deleted) {
        res.status(404);
        throw new Error("Review not found or unauthorized");
    }
    res.json({ success: true, message: "Review deleted successfully" });
});

module.exports = { createReview, getReviewsForService, getReviewById, updateReview, deleteReview };