const express = require('express');
const router = express.Router();
const { 
    createPost, 
    getPosts, 
    getPostById, 
    getPostBySlug, 
    updatePost, 
    deletePost 
} = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all posts with optional search
router.get('/', getPosts);

// Create a new post
router.post('/',authMiddleware, createPost);

// Get a post by slug
router.get('/slug/:slug', getPostBySlug);

// Get, update, delete post by ID
router.get('/:id', getPostById);
router.put('/:id',authMiddleware, updatePost);
router.delete('/:id',authMiddleware, deletePost);

module.exports = router;
