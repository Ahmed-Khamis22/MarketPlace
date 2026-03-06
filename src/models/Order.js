const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },

    // snapshot وقت الطلب
    priceSnapshot: {
      type: Number,
      required: true,
    },
    titleSnapshot: {
      type: String,
      required: true,
    },

    // تفاصيل يكتبها العميل
    requirements: {
      type: String,
      default: "",
      maxlength: 3000,
    },

    acceptedAt: Date,
    rejectedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

const validateCreateOrder = (order) => {
    const schema = Joi.object({
        service: Joi.string().required(),
    });
    return schema.validate(order);
}

module.exports = {
    Order: mongoose.model('Order', orderSchema),
    validateCreateOrder
};