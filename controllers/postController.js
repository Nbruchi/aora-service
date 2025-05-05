const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const validateID = require('../utils/validateID');
const formatNumber = require('../utils/formatNumber');
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

    // Create post object with image references and creator
    const postData = {
        title,
        slug,
        description,
        creator: req.user._id,
        images: images || [],
        likes: [req.user._id] // Creator automatically likes their own post
    };

    // Create and save the post
    const post = await Post.create(postData);

    // Add post to creator's likedPosts
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { likedPosts: post._id }
    });

    // Populate creator and images information before sending response
    const populatedPost = await Post.findById(post._id)
        .populate({
            path: 'creator',
            select: 'username email'
        })
        .populate({
            path: 'images',
            select: '-data'
        });

    // Add formatted like and save counts
    const postObj = populatedPost.toObject();
    const likesCount = populatedPost.likes ? populatedPost.likes.length : 0;
    const savesCount = populatedPost.saves ? populatedPost.saves.length : 0;

    postObj.likesCount = likesCount;
    postObj.savesCount = savesCount;
    postObj.formattedLikes = `${formatNumber(likesCount)} ${likesCount === 1 ? 'like' : 'likes'}`;
    postObj.formattedSaves = `${formatNumber(savesCount)} ${savesCount === 1 ? 'save' : 'saves'}`;

    // For a new post, the creator is automatically the first to like it
    postObj.isLiked = true;
    postObj.isSaved = false;

    res.status(201).json(postObj);
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

    const posts = await Post.find(filter)
        .populate({
            path: 'images',
            select: '-data'
        })
        .populate({
            path: 'creator',
            select: 'username email'
        });

    // Add formatted like and save counts to each post
    const postsWithFormattedCounts = posts.map(post => {
        const postObj = post.toObject();
        const likesCount = post.likes ? post.likes.length : 0;
        const savesCount = post.saves ? post.saves.length : 0;

        postObj.likesCount = likesCount;
        postObj.savesCount = savesCount;
        postObj.formattedLikes = `${formatNumber(likesCount)} ${likesCount === 1 ? 'like' : 'likes'}`;
        postObj.formattedSaves = `${formatNumber(savesCount)} ${savesCount === 1 ? 'save' : 'saves'}`;

        // Check if user is authenticated and has liked/saved the post
        if (req.user) {
            postObj.isLiked = post.likes.includes(req.user._id);
            postObj.isSaved = post.saves.includes(req.user._id);
        }

        return postObj;
    });

    res.json(postsWithFormattedCounts);
});

// Get a single post by ID
const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const post = await Post.findById(id)
        .populate({
            path: 'images',
            select: '-data'
        })
        .populate({
            path: 'creator',
            select: 'username email'
        });

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Add formatted like and save counts
    const postObj = post.toObject();
    const likesCount = post.likes ? post.likes.length : 0;
    const savesCount = post.saves ? post.saves.length : 0;

    postObj.likesCount = likesCount;
    postObj.savesCount = savesCount;
    postObj.formattedLikes = `${formatNumber(likesCount)} ${likesCount === 1 ? 'like' : 'likes'}`;
    postObj.formattedSaves = `${formatNumber(savesCount)} ${savesCount === 1 ? 'save' : 'saves'}`;

    // Check if user is authenticated and has liked/saved the post
    if (req.user) {
        postObj.isLiked = post.likes.includes(req.user._id);
        postObj.isSaved = post.saves.includes(req.user._id);
    }

    res.json(postObj);
});

// Get a single post by slug
const getPostBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const post = await Post.findOne({ slug })
        .populate({
            path: 'images',
            select: '-data'
        })
        .populate({
            path: 'creator',
            select: 'username email'
        });

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Add formatted like and save counts
    const postObj = post.toObject();
    const likesCount = post.likes ? post.likes.length : 0;
    const savesCount = post.saves ? post.saves.length : 0;

    postObj.likesCount = likesCount;
    postObj.savesCount = savesCount;
    postObj.formattedLikes = `${formatNumber(likesCount)} ${likesCount === 1 ? 'like' : 'likes'}`;
    postObj.formattedSaves = `${formatNumber(savesCount)} ${savesCount === 1 ? 'save' : 'saves'}`;

    // Check if user is authenticated and has liked/saved the post
    if (req.user) {
        postObj.isLiked = post.likes.includes(req.user._id);
        postObj.isSaved = post.saves.includes(req.user._id);
    }

    res.json(postObj);
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

    // Populate creator information before sending response
    const populatedPost = await Post.findById(updatedPost._id)
        .populate({
            path: 'creator',
            select: 'username email'
        })
        .populate({
            path: 'images',
            select: '-data'
        });

    // Add formatted like and save counts
    const postObj = populatedPost.toObject();
    const likesCount = populatedPost.likes ? populatedPost.likes.length : 0;
    const savesCount = populatedPost.saves ? populatedPost.saves.length : 0;

    postObj.likesCount = likesCount;
    postObj.savesCount = savesCount;
    postObj.formattedLikes = `${formatNumber(likesCount)} ${likesCount === 1 ? 'like' : 'likes'}`;
    postObj.formattedSaves = `${formatNumber(savesCount)} ${savesCount === 1 ? 'save' : 'saves'}`;

    // Check if user is authenticated and has liked/saved the post
    if (req.user) {
        postObj.isLiked = populatedPost.likes.includes(req.user._id);
        postObj.isSaved = populatedPost.saves.includes(req.user._id);
    }

    res.json(postObj);
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

// Like or unlike a post
const likePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const post = await Post.findById(id);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const user = await User.findById(req.user._id);

    // Check if user has already liked the post
    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
        // Unlike the post
        post.likes = post.likes.filter(userId => userId.toString() !== req.user._id.toString());
        user.likedPosts = user.likedPosts.filter(postId => postId.toString() !== id);
    } else {
        // Like the post
        post.likes.push(req.user._id);
        user.likedPosts.push(id);
    }

    await post.save();
    await user.save();

    // Format the like count
    const formattedLikes = formatNumber(post.likes.length);

    res.json({
        isLiked: !isLiked,
        likes: post.likes.length,
        formattedLikes: `${formattedLikes} ${post.likes.length === 1 ? 'like' : 'likes'}`
    });
});

// Save or unsave a post
const savePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const post = await Post.findById(id);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const user = await User.findById(req.user._id);

    // Check if user has already saved the post
    const isSaved = post.saves.includes(req.user._id);

    if (isSaved) {
        // Unsave the post
        post.saves = post.saves.filter(userId => userId.toString() !== req.user._id.toString());
        user.savedPosts = user.savedPosts.filter(postId => postId.toString() !== id);
    } else {
        // Save the post
        post.saves.push(req.user._id);
        user.savedPosts.push(id);
    }

    await post.save();
    await user.save();

    // Format the save count
    const formattedSaves = formatNumber(post.saves.length);

    res.json({
        isSaved: !isSaved,
        saves: post.saves.length,
        formattedSaves: `${formattedSaves} ${post.saves.length === 1 ? 'save' : 'saves'}`
    });
});

// Get user's interaction status with a post
const getPostInteraction = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id);

    const post = await Post.findById(id);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check if user has liked or saved the post
    const isLiked = post.likes.includes(req.user._id);
    const isSaved = post.saves.includes(req.user._id);

    // Format the counts
    const formattedLikes = formatNumber(post.likes.length);
    const formattedSaves = formatNumber(post.saves.length);

    res.json({
        isLiked,
        isSaved,
        likes: post.likes.length,
        saves: post.saves.length,
        formattedLikes: `${formattedLikes} ${post.likes.length === 1 ? 'like' : 'likes'}`,
        formattedSaves: `${formattedSaves} ${post.saves.length === 1 ? 'save' : 'saves'}`
    });
});

module.exports = {
    createPost,
    getPosts,
    getPostById,
    getPostBySlug,
    updatePost,
    deletePost,
    likePost,
    savePost,
    getPostInteraction
};
