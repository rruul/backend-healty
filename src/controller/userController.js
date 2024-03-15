const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('./../config/firebase')

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Buscamos el usuario para verificar que existe el correo electronico
        //ahora con firebase-admin solo lo podemos poner asi
        const userDoc = await admin.firestore().collection('users').doc(email).get()
        
        // Si no existe el usuario
        if (!userDoc.exists) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const userData = userDoc.data()

        // Verificar si el password es correcto
        const isValidPassword = await bcrypt.compare(password, userData.password)

        if(!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid Credentials'
            })
        }

        // Genera el TOKEN
        const token = jwt.sign({ email: userData.email}, process.env.SECRET, { expiresIn: '1h' })
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const hashed = await bcrypt.hash(password, 10)

        //Guardar en la DB
        await admin.firestore().collection('users').doc(email).set({
            email,
            password: hashed
        })
        res.status(201).json({
            message: 'User registered successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'InternaL Server Error'
        })
    }
}

module.exports = { registerUser, loginUser }