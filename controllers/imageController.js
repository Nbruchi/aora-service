const Image = require('../models/ImageModel');
const validateID = require('../utils/validateID');
const asyncHandler = require("express-async-handler");
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Middleware to handle image upload
const uploadImage = upload.single('image');

// Upload an image
const createImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please provide an image file');
    }

    // Calculate image size in human-readable format
    const bytes = req.file.buffer.length;
    let size;

    if (bytes < 1024) {
        size = bytes + 'B';
    } else if (bytes < 1024 * 1024) {
        size = (bytes / 1024).toFixed(2) + 'KB';
    } else {
        size = (bytes / (1024 * 1024)).toFixed(2) + 'MB';
    }

    const image = await Image.create({
        name: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
        size: size
    });

    res.status(201).json({
        _id: image._id,
        name: image.name,
        contentType: image.contentType,
        size: image.size,
        createdAt: image.createdAt
    });
});

const getImages = asyncHandler(async (req, res) => {
    const images = await Image.find().select('_id name contentType size createdAt updatedAt');
    res.json(images);
})

// Get an image by ID
const getImageById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const image = await Image.findById(id);

    if (!image) {
        res.status(404);
        throw new Error('Image not found');
    }

    res.set('Content-Type', image.contentType);
    res.send(image.data);
});

// Delete an image
const deleteImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const image = await Image.findById(id);

    if (!image) {
        res.status(404);
        throw new Error('Image not found');
    }

    await Image.deleteOne({ _id: id });
    res.json({ message: 'Image deleted' });
});

module.exports = {
    uploadImage,
    getImages,
    createImage,
    getImageById,
    deleteImage
};
