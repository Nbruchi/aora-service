const express = require('express');
const router = express.Router();
const { 
    registerUser,
    loginUser,
    logout,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);

// User management routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id',authMiddleware, updateUser);
router.delete('/:id',authMiddleware, deleteUser);

module.exports = router;