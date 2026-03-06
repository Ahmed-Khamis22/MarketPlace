const Order = require('../models/Order').Order;
const Service = require('../models/Service').Service;
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const { requirements } = req.body;
    const client = req.user._id;

    const service = await Service.findById(serviceId);

    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    if (service.provider.toString() === client.toString()) {
        res.status(400);
        throw new Error("You cannot order your own service");
    }

    const existingOrder = await Order.findOne({
        service: serviceId,
        client,
        status: { $in: ["pending", "accepted"] },
    });

    if (existingOrder) {
        res.status(400);
        throw new Error("You already have an active order for this service");
    }

    const cleanRequirements = (requirements || "").trim();

    const order = await Order.create({
        service: service._id,
        client,
        provider: service.provider,
        priceSnapshot: service.price,
        titleSnapshot: service.title,
        requirements: cleanRequirements,
        status: "pending",
    });

    res.status(201).json({
        success: true,
        order
    });
});

const getAllOrders = asyncHandler(async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    const userId = req.user._id;

    const Page = Math.max(1, parseInt(page));
    const Limit = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (Page - 1) * Limit;

    const orders = await Order.find({
        $or: [
            { client: userId },
            { provider: userId }
        ]
    })
    .skip(skip)
    .limit(Limit)
    .populate('service', 'title')
    .populate('client', 'name email')
    .populate('provider', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders
    });
});

const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, client: userId, status: "pending" })
    .populate('service', 'title')
    .populate('client', 'name email')
    .populate('provider', 'name email');

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    res.status(200).json({
        success: true,
        order
    });
});

const updateOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;
    const { requirements } = req.body;

    const cleanRequirements = (requirements || "").trim();

    const order = await Order.findOneAndUpdate(
        { _id: orderId, client: userId, status: "pending" },
        { requirements: cleanRequirements },
        { new: true }
    );

    if (!order) {
        res.status(404);
        throw new Error("Order not found or unauthorized");
    }

    res.status(200).json({
        success: true,
        order
    });

});

const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;    

    const order = await Order.findOneAndDelete(
        { _id: orderId, client: userId, status: "pending" }
    );

    if (!order) {
        res.status(404);
        throw new Error("Order not found or unauthorized");
    }

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;
    const { status } = req.body;

    const validStatuses = ["accepted", "rejected", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error("Invalid status");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    // =====================
    // PROVIDER LOGIC
    // =====================
    if (order.provider.toString() === userId.toString()) {

        if (status === "accepted" && order.status === "pending") {
        order.status = "accepted";
        order.acceptedAt = new Date();
        }

        else if (status === "rejected" && order.status === "pending") {
        order.status = "rejected";
        order.rejectedAt = new Date();
        }

        else if (status === "completed" && order.status === "accepted") {
        order.status = "completed";
        order.completedAt = new Date();
        }

        else {
        res.status(400);
        throw new Error("Invalid status transition");
        }
    }

    // =====================
    // CLIENT LOGIC
    // =====================
    else if (order.client.toString() === userId.toString()) {

        if (status === "cancelled" && order.status === "pending") {
        order.status = "cancelled";
        order.cancelledAt = new Date();
        } else {
        res.status(400);
        throw new Error("Client cannot change to this status");
        }
    }

    else {
        res.status(403);
        throw new Error("Unauthorized");
    }

    await order.save();

    res.status(200).json({
        success: true,
        order
    });
});

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, updateOrderStatus };