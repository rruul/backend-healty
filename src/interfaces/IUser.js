class IUser {
    /*
        Crear un nuevo usuario
        @param {string} email -> correo del usuario
        @param {string} password -> contraseña del usuario
        @returns {Promise<User>} -> Promesa que resuelve en un objeto User
        @throws {Error} -> Error en caso de que no se pueda crear el usuario
    */
    static async createUser(email, password, nombre, apaterno, amaterno, direccion, telefono) {}
    static async findByEmail(email) {}
    async verifyPassword(password) {}
}

module.exports = IUser