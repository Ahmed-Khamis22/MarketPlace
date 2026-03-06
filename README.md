# 🛒 MarketPlace API - Professional Back-End Service

A robust, scalable, and secure RESTful API built with **Node.js**, **Express**, and **MongoDB**. This project showcases a complete marketplace ecosystem where users can offer services, manage orders, and provide reviews with real-time-ready architecture.

---

## 🚀 Key Features

* **User Management**: Complete Authentication system (Register/Login) with JWT and Refresh Tokens.
* **Service Lifecycle**: Full CRUD for services with image uploads via **Cloudinary**.
* **Order System**: Sophisticated order state management (Pending, Accepted, Rejected, Completed, Cancelled).
* **Review System**: One-to-one review constraint per service with average rating logic.
* **Security & Validation**: Data integrity enforced by **Joi** and secure password hashing with **Bcrypt**.
* **Professional Error Handling**: Centralized error management and custom Not Found middleware.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js / Express** | Runtime & Framework |
| **MongoDB / Mongoose** | NoSQL Database & ODM |
| **JWT** | Secure Authentication (Access & Refresh Tokens) |
| **Cloudinary** | Cloud-based Image Management |
| **Multer** | Middleware for handling `multipart/form-data` |
| **Joi** | Schema Description & Data Validation |

---

## 🏗️ Architecture

The project follows the **MVC (Model-View-Controller)** pattern to ensure scalability and clean code separation.

```text
📂 src
 ├── 📁 config        # Database and Environment configurations
 ├── 📁 controllers   # Request handling logic
 ├── 📁 middlewares   # Auth, Upload, and Error handlers
 ├── 📁 models        # Mongoose Schemas & Joi Validations
 ├── 📁 routers       # API Route definitions
 └── 📄 app.js        # Express App configuration

🚦 API Endpoints (Quick Look)
🔐 Authentication
POST /api/auth/register - Create a new account.

POST /api/auth/login - Get Access & Refresh tokens.

🛠️ Services
GET /api/services - List all services (with Pagination & Search).

POST /api/services - Create a service (Provider only).

📦 Orders
POST /api/orders/:serviceId - Place a new order.

PUT /api/orders/:orderId/status - Update order status (Provider/Client logic).

⭐ Reviews
POST /api/reviews/:serviceId - Create a review.

GET /api/reviews/:serviceId - Get all reviews for a service.

⚙️ Environment Variables
To run this project, you will need to add the following environment variables to your .env file:

👨‍💻 Author
Ahmed Khamis Senior Computer Science Student @ Cairo University

Junior Back-End Focused Developer with 1 year of QA Experience
