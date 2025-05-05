# 🚀 Aora Backend API

A RESTful API backend for the Aora application, providing user authentication, post management, and image handling functionality.

## 📑 Table of Contents

- [✨ Features](#features)
- [🛠️ Technologies Used](#technologies-used)
- [🏁 Getting Started](#getting-started)
  - [📋 Prerequisites](#prerequisites)
  - [⚙️ Installation](#installation)
  - [🔐 Environment Variables](#environment-variables)
- [📚 API Documentation](#api-documentation)
  - [🔑 Authentication Endpoints](#authentication-endpoints)
  - [👤 User Endpoints](#user-endpoints)
  - [📝 Post Endpoints](#post-endpoints)
  - [🖼️ Image Endpoints](#image-endpoints)
- [📂 Project Structure](#project-structure)
- [📄 License](#license)

## ✨ Features

- 🔐 User authentication (register, login, logout)
- 👤 User management (CRUD operations)
- 📝 Post management with slug-based URLs
- 🖼️ Image upload and management
- ⚠️ Error handling middleware
- 🗄️ MongoDB database integration

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **multer** - File upload handling
- **morgan** - HTTP request logger
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## 🏁 Getting Started

### 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd aora/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the development server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:<PORT>` where PORT is defined in your .env file.

### 🔐 Environment Variables

```
PORT=                # Server port
MONGO_URI=           # MongoDB connection string
JWT_SECRET=          # Secret for JWT token generation
```

## 📚 API Documentation

### 🔑 Authentication Endpoints

#### 📝 Register a new user
- **URL**: `/api/v1/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "example",
    "email": "example@example.com",
    "password": "password123"
  }
  ```

#### 🔓 Login
- **URL**: `/api/v1/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "example@example.com",
    "password": "password123"
  }
  ```

#### 🔒 Logout
- **URL**: `/api/v1/users/logout`
- **Method**: `POST`

### 👤 User Endpoints

#### 📋 Get all users
- **URL**: `/api/v1/users`
- **Method**: `GET`

#### 🔍 Get user by ID
- **URL**: `/api/v1/users/:id`
- **Method**: `GET`

#### ✏️ Update user
- **URL**: `/api/v1/users/:id`
- **Method**: `PUT`
- **Auth**: Required
- **Body**:
  ```json
  {
    "username": "newUsername",
    "email": "newemail@example.com"
  }
  ```

#### 🗑️ Delete user
- **URL**: `/api/v1/users/:id`
- **Method**: `DELETE`
- **Auth**: Required

### 📝 Post Endpoints

#### 📋 Get all posts
- **URL**: `/api/v1/posts`
- **Method**: `GET`
- **Query Parameters**:
  - `search`: Search term for filtering posts

#### ✨ Create a new post
- **URL**: `/api/v1/posts`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "title": "Post Title",
    "description": "Post description content",
    "images": ["imageId1", "imageId2"]
  }
  ```

#### 🔍 Get post by slug
- **URL**: `/api/v1/posts/slug/:slug`
- **Method**: `GET`

#### 🔍 Get post by ID
- **URL**: `/api/v1/posts/:id`
- **Method**: `GET`

#### ✏️ Update post
- **URL**: `/api/v1/posts/:id`
- **Method**: `PUT`
- **Auth**: Required

#### 🗑️ Delete post
- **URL**: `/api/v1/posts/:id`
- **Method**: `DELETE`
- **Auth**: Required

### 🖼️ Image Endpoints

#### 📤 Upload image
- **URL**: `/api/v1/images`
- **Method**: `POST`
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `image`: Image file

#### 📋 Get all images
- **URL**: `/api/v1/images`
- **Method**: `GET`

#### 🔍 Get image by ID
- **URL**: `/api/v1/images/:id`
- **Method**: `GET`

#### 🗑️ Delete image
- **URL**: `/api/v1/images/:id`
- **Method**: `DELETE`
- **Auth**: Required

## 📂 Project Structure

```
server/
├── config/             # Configuration files
│   └── dbConnection.js # Database connection setup
├── controllers/        # Request handlers
│   ├── userController.js
│   ├── postController.js
│   └── imageController.js
├── middlewares/        # Custom middleware functions
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models/             # Database models
│   ├── UserModel.js
│   ├── PostModel.js
│   └── ImageModel.js
├── routes/             # API routes
│   ├── userRoutes.js
│   ├── postRoutes.js
│   └── imageRoutes.js
├── utils/              # Utility functions
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── index.js            # Application entry point
└── package.json        # Project dependencies
```

## 📄 License

This project is licensed under the ISC License.
