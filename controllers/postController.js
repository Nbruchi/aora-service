const Post = require('../models/PostModel');
const validateID = require('../utils/validateID');
const asyncHandler = require("express-async-handler");
const slugify = require('slugify');

// Create a new post
const createPost = asyncHandler(async (req, res) => {
    const { title, description, images } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error('Please provide title and description');
    }

    // Generate slug from title
    const slug = slugify(title, {
        lower: true,
        strict: true
    });

    // Check if post with this slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
        res.status(400);
        throw new Error('A post with this title already exists');
    }

    // Create post object with image references
    const postData = {
        title,
        slug,
        description,
        images: images || []
    };

    // Create and save the post
    const post = await Post.create(postData);
    res.status(201).json(post);
});

// Get all posts with optional filtering
const getPosts = asyncHandler(async (req, res) => {
    const { search } = req.query;
    let filter = {};

    if (search) {
        const regex = new RegExp(search, 'gi');
        filter = {
            $or: [
                { title: regex },
                { description: regex }
            ]
        };
    }

    const posts = await Post.find(filter).populate({
        path: 'images',
        select: '-data'
    });
    res.json(posts);
});

// Get a single post by ID
const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const post = await Post.findById(id).populate({
        path: 'images',
        select: '-data'
    });

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    res.json(post);
});

// Get a single post by slug
const getPostBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }).populate({
        path: 'images',
        select: '-data'
    });

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    res.json(post);
});

// Update a post
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const post = await Post.findById(id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Update fields if provided
    if (req.body.title) {
        post.title = req.body.title;
        post.slug = slugify(req.body.title, {
            lower: true,
            strict: true
        });
    }

    if (req.body.description) {
        post.description = req.body.description;
    }

    // Update image references if provided
    if (req.body.images) {
        post.images = req.body.images;
    }

    // Save the updated post
    const updatedPost = await post.save();
    res.json(updatedPost);
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const post = await Post.findById(id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    await Post.deleteOne({ _id: id });
    res.json({ message: 'Post deleted' });
});

module.exports = {
    createPost,
    getPosts,
    getPostById,
    getPostBySlug,
    updatePost,
    deletePost
};
