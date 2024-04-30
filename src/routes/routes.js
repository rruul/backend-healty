const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser} = require('./../controller/userController')
const authenticateToken = require('./../auth/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/get-all-users', authenticateToken,  getAllUsers)
router.delete('/users/:email', authenticateToken, deleteUser)
router.put('/users/:email', authenticateToken, updateUser)

module.exports = router