const express = require('express');
const router = express.Router();
const { 
    uploadImage,
    createImage, 
    getImageById, 
    deleteImage,
    getImages, getImagesByUserId
} = require('../controllers/imageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Upload a new image
router.post('/', uploadImage,authMiddleware, createImage);

// Get or delete an image by ID
router.get('/user/:userId', authMiddleware, getImagesByUserId);
router.get('/', getImages);
router.get('/:id', getImageById);
router.delete('/:id',authMiddleware, deleteImage);

module.exports = router;