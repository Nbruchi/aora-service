const mongoose = require('mongoose');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');
require('dotenv').config();

/**
 * This script migrates existing posts to include a creator field.
 * It should be run once after updating the Post model to include the creator field.
 * 
 * Usage: node utils/migratePostsCreator.js
 */

const migratePostsCreator = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the first admin user to set as default creator
        const defaultUser = await User.findOne();
        
        if (!defaultUser) {
            console.error('No users found in the database. Please create a user first.');
            process.exit(1);
        }

        console.log(`Using user ${defaultUser.username} as default creator for existing posts`);

        // Find all posts without a creator
        const postsWithoutCreator = await Post.find({ creator: { $exists: false } });
        
        if (postsWithoutCreator.length === 0) {
            console.log('No posts found without a creator. Migration not needed.');
            process.exit(0);
        }

        console.log(`Found ${postsWithoutCreator.length} posts without a creator`);

        // Update all posts without a creator
        const updateResult = await Post.updateMany(
            { creator: { $exists: false } },
            { $set: { creator: defaultUser._id } }
        );

        console.log(`Updated ${updateResult.modifiedCount} posts with default creator`);
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the migration
migratePostsCreator();