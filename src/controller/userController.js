const jwt = require('jsonwebtoken')
const User = require('../models/User')
const admin = require('firebase-admin')
const bcrypt = require('bcrypt')

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Buscamos el usuario para verificar que existe el correo electronico
        //ahora con firebase-admin solo lo podemos poner asi
        const userDoc = await User.findByEmail(email)
        if (!userDoc) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Verificar contrase;a
        const isValidPassword = await userDoc.verifyPassword(password)

        if(!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid Credentials'
            })
        }

        // Genera el TOKEN
        const token = jwt.sign({ email: userDoc.email }, process.env.SECRET, { expiresIn: '1h' })
        res.status(200).json({ 
            message: 'success',
            token
         })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, password, nombre, apaterno, amaterno, direccion, telefono } = req.body
        const existingUser = await User.findByEmail(email)
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }
        const newUser = await User.createUser(email, password, nombre, apaterno, amaterno, direccion, telefono)
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        })
        
        // Encriptar la contrase;a
        const hashed = await bcrypt.hash(password, 10)

        //Guardar en la DB
        await admin.firestore().collection('users').doc(email).set({
            email: email,
            password: hashed,
            nombre: nombre,
            apaterno: apaterno,
            amaterno: amaterno,
            direccion: direccion,
            telefono: telefono
        })
    } catch (error) {
        console.log('Error: ', error)
        res.status(500).json({
            message: 'InternaL Server Error'
        })
    }
}

const getAllUsers = async (req, res) => {
    try{
        const users = await User.getAllUsers()
        res.json({
            users,
            message: 'success'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const deleteUser = async (req, res) => {
    const userEmail = req.params.email
    try{
        await User.deleteUser(userEmail)
        res.status(204).send()
        message: 'success'
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const updateUser = async (req, res) => {
    const userEmail = req.params.email
    const userData = req.body
    try{
        const userUpdate = await User.updateUser(userEmail, userData)
        res.json({
            userUpdate,
            message: 'success'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = { registerUser, loginUser, getAllUsers, deleteUser, updateUser }