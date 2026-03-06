# ServiceHub API

Backend API for a service marketplace platform where providers can publish services and clients can order them.

## Features
- Authentication (JWT)
- User roles (Client / Provider)
- Create / Update / Delete Services
- Order system
- Review system
- Image upload using Cloudinary
- Pagination & search

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer

## API Modules

### Users
Register / Login / Refresh Token

### Services
Providers can create and manage services.

### Orders
Clients can order services and providers manage order status.

### Reviews
Clients can rate services.

## Installation

```bash
git clone https://github.com/Ahmed-Khamis22/MarketPlace.git
npm install
