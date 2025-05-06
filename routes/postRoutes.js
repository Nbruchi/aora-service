const express = require('express');
const router = express.Router();
const { 
    createPost, 
    getPosts, 
    getPostById, 
    getPostBySlug, 
    updatePost, 
    deletePost,
    likePost,
    savePost,
    getPostInteraction,
    getPostsByUserId
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

// Like, save, and get interaction status for a post
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/save', authMiddleware, savePost);
router.get('/:id/interaction', authMiddleware, getPostInteraction);

// Get posts by user ID
router.get('/user/:userId', getPostsByUserId);

module.exports = router;
