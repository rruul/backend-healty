const bcrypt = require('bcrypt')
const admin = require('../config/firebase')
const IUser = require('../interfaces/IUser')
const firestore = admin.firestore()

class User extends IUser {
    constructor (email, password, nombre, apaterno, amaterno, direccion, telefono) {
        super()
        this.email = email
        this.password = password
        this.nombre = nombre
        this.apaterno = apaterno
        this.amaterno = amaterno
        this.direccion = direccion
        this.telefono = telefono
    }
    static async createUser (email, password, nombre, apaterno, amaterno, direccion, telefono) {
        try {
            const hash = await bcrypt.hash(password, 10)
            const user = firestore.collection('users').doc(email)
            await user.set({
                email,
                password: hash,
                nombre,
                apaterno,
                amaterno,
                direccion,
                telefono
            })
            return new User(email, password, nombre, apaterno, amaterno, direccion, telefono)
        } catch (error) {
            console.log('Error: ', error)
        }
    }
    async verifyPassword (password) {
        return await bcrypt.compare(password, this.password)
    }
    static async findByEmail (email) {
        try {
            const user = firestore.collection('users').doc(email)
            const userDoc = await user.get()
            if (userDoc.exists) {
                const userData = userDoc.data()
                return new User(userData.email, userData.password)
            }
            return null
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    static async getAllUsers () {
        try {
            const users = await firestore.collection('users').get()
            const foundUsers = []
            users.forEach(doc => {
                foundUsers.push({
                    email: doc.email,
                    ...doc.data()
                })
            })
            return foundUsers
        } catch (error) {
            message: 'Internal Server Error'
        }
    }

    static async deleteUser (userEmail) {
        try {
            await firestore.collection('users').doc(userEmail).delete()
            message: 'success'
        } catch (error) {
            message: 'Internal Server Error'
        }
    }

    static async updateUser (userEmail, userData) {
        try {
            await firestore.collection('users').doc(userEmail).update(userData)
            const userUpdated = await firestore.collection('users').doc(userEmail).get()
            return {userUpdated: userUpdated.data()}
        } catch (error) {
            message: 'Internal Server Error'
        }
    }
}

module.exports = User