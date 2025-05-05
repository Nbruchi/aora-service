const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const generateToken = require('../config/jwtToken');
const validateID = require('../utils/validateID');
const asyncHandler = require("express-async-handler")
const sea = require("node:sea");

const registerUser = asyncHandler(async (req, res) => {
    const {username,email,password} = req.body;

    const foundUser = await User.findOne({email});

    if (!foundUser){
        const user = await User.create({username,email,password});
        res.json(user)
    }else{
        throw new Error('User already exists');
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const {email,password} = req.body;

    const foundUser = await User.findOne({email});

    if (foundUser && (await foundUser.matchPassword(password))){
        const token = generateToken(foundUser._id);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production'
        })

        res.json({
            _id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            token
        })
    }else{
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token",{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict"
    })

    res.json({message: 'Logged out'})
})

const getUsers = asyncHandler(async (req,res) =>{
    const {search} = req.query;
    let filter ={};

    if (search){
        const regex = new RegExp(search, 'gi');
        filter = {
            $or: [
                {username: regex},
                {email: regex}
            ]
        }
    }
    const users = await User.find(filter).select('-password');
    res.json(users);
})

const getUser = asyncHandler(async (req,res) =>{
    const {id} = req.params;

    const user = await User.findById(id).select('-password');

    if (!user){
        throw new Error('User not found');
    }

    res.json(user);
})

const updateUser = asyncHandler(async (req,res) =>{
    const {id} = req.params;
    validateID(id);

    const user = await User.findById(id)

    if (!user){
        res.status(404);
        throw new Error('User not found');
    }

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password; // will hash via pre-save hook

    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);

})

const deleteUser = asyncHandler(async (req,res) =>{
    const {id} = req.params;
    validateID(id);
    const user = await User.findById(id);

    if (!user){
        res.status(404);
        throw new Error('User not found');
    }

    await User.deleteOne({_id: id});
    res.json({message: 'User deleted'});
})

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}