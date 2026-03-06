// controllers/service.controller.js
const asyncHandler = require("express-async-handler");
const {Service} = require("../models/Service");
const cloudinary = require('cloudinary').v2;

const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

const getAllServices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 , search = "" , category = ""} = req.query;
  // pagination logic greater than 0 and less than 50
  const Page = Math.max(1, Number(page) || 1);
  const Limit = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (Page - 1) * Limit;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }
  const services = await Service.find(query)
    .skip(skip)
    .limit(Limit)
    .sort({ createdAt: -1 })
    .populate("provider", "name email");

  const total = await Service.countDocuments(query);
  const totalPages = Math.ceil(total / Limit);
  
  res.json({ success: true,
    services, 
    pagination: { 
      currentPage: Page,
      totalPages,
      totalPosts: total,
      hasNext: Page < totalPages,
      hasPrev: Page > 1
    },
    appliedFilters: {
      search, category
    }
  });
});

const getServiceById = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const service = await Service.findById(serviceId).populate("provider", "name email");
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.json({ success: true, service });
});

const createService = asyncHandler(async (req, res) => {
  const { title, description, price, category } = req.body;

  // ✅ business rule: image required
  if (!req.file) {
    res.status(400);
    throw new Error("Image is required");
  }

  // ✅ business rule: provider comes from token (not from body)
  const provider = req.user._id;

  // ✅ basic defensive checks (even if model validates)
  const cleanTitle = (title || "").trim();
  const cleanDesc = (description || "").trim();
  const numericPrice = Number(price);

  if (!cleanTitle || !cleanDesc || !Number.isFinite(numericPrice)) {
    res.status(400);
    throw new Error("Invalid title/description/price");
  }
  if (numericPrice <= 0) {
    res.status(400);
    throw new Error("Price must be greater than 0");
  }

  // ✅ category validation
  if (!category || category.trim() === "") {
    res.status(400);
    throw new Error("Category is required");
  }

  // ✅ CloudinaryStorage output
  const imageUrl = req.file.path;
  const imagePublicId = req.file.filename;

  try {
    // Create the service object
    const service = await Service.create({
      title: cleanTitle,
      description: cleanDesc,
      price: numericPrice,
      category,
      provider,
      imageUrl,
      imagePublicId,
    });

    res.status(201).json({
      success: true,
      service: {
        _id: service._id,
        title: service.title,
        description: service.description,
        price: service.price,
        category: service.category,
        provider: service.provider,
        imageUrl: service.imageUrl,
        averageRating: service.averageRating,
        totalReviews: service.totalReviews,
        createdAt: service.createdAt,
      },
    });
  } catch (error) {
    // Handle any other errors
    res.status(500);
    throw new Error("Error creating service");
  }
});

const updateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { title, description, price, category } = req.body;
  const providerId = req.user._id;

  // 1) هات الخدمة + owner check
  const existing = await Service.findOne({ _id: serviceId, provider: providerId });
  if (!existing) {
    res.status(404);
    throw new Error("Service not found");
  }

  const updateData = {};

  const cleanTitle = (title || "").trim();
  const cleanDesc = (description || "").trim();
  const cleanCategory = (category || "").trim();

  if (cleanTitle) updateData.title = cleanTitle;
  if (cleanDesc) updateData.description = cleanDesc;
  if (cleanCategory) updateData.category = cleanCategory;

  // price (partial + validation)
  if (price !== undefined) {
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      res.status(400);
      throw new Error("Price must be a number greater than 0");
    }
    updateData.price = numericPrice;
  }

  // image (optional)
  const oldPublicId = existing.imagePublicId;
  if (req.file) {
    updateData.imageUrl = req.file.path;
    updateData.imagePublicId = req.file.filename;
  }

  // لو مفيش حاجة هتتغير
  if (Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error("No valid fields to update");
  }

  // 2) update
  const updatedService = await Service.findOneAndUpdate(
    { _id: serviceId, provider: providerId },
    { $set: updateData },
    { new: true }
  );

  // 3) امسح الصورة القديمة بعد نجاح التحديث (لو فيه صورة جديدة)
  if (req.file && oldPublicId) {
    await deleteImageFromCloudinary(oldPublicId);
  }

  res.json({
    success: true,
    service: {
      _id: updatedService._id,
      title: updatedService.title,
      description: updatedService.description,
      price: updatedService.price,
      category: updatedService.category,
      provider: updatedService.provider,
      imageUrl: updatedService.imageUrl,
      averageRating: updatedService.averageRating,
      totalReviews: updatedService.totalReviews,
      createdAt: updatedService.createdAt,
    },
  });
});

const deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const providerId = req.user._id;

  // 1) هات الخدمة + owner check
  const existing = await Service.findOne({ _id: serviceId, provider: providerId });
  if (!existing) {
    res.status(404);
    throw new Error("Service not found");
  }

  // 2) امسح الصورة الأول
  if (existing.imagePublicId) {
    await deleteImageFromCloudinary(existing.imagePublicId);
  }

  // 3) امسح الخدمة من DB
  await existing.deleteOne();

  res.json({ success: true, message: "Service deleted successfully" });
});

module.exports = { createService, updateService, deleteService, getAllServices, getServiceById };