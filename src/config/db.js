const mongoose = require("mongoose");

const dbConnection = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing. Check your .env file");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000, // بدل 10 ثواني
    });
    console.log("DB online");
  } catch (error) {
    // اطبع السبب الحقيقي
    console.error("MongoDB connection failed:");
    console.error("Message:", error.message);

    // رسائل مفيدة حسب النوع
    if (error.message?.includes("not authorized")) {
      console.error("Cause: wrong DB user/password or no permissions.");
    }
    if (error.message?.includes("IP") || error.message?.includes("whitelist")) {
      console.error("Cause: your IP is not whitelisted in MongoDB Atlas.");
    }
    if (error.message?.includes("ReplicaSetNoPrimary")) {
      console.error("Cause: cluster paused/down or network can't reach Atlas.");
    }

    throw error; // سيب الخطأ الأصلي يطلع زي ما هو
  }
};

module.exports = { dbConnection };