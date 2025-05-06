require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT;
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectDB = require("./config/dbConnection.js");
const {notFound, errorHandler} = require("./middlewares/errorHandler.js");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const imageRoutes = require("./routes/imageRoutes");

connectDB();

// Configure CORS to allow requests from the mobile app
app.use(cors({
  origin: true, // Allow requests from any origin in development
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/images", imageRoutes);

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
