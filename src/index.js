const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const serviceAccount = require('./config/serviceAccountKey.json')

//rutas que se utilizaran
const auth = require('./routes/auth')
const users = require('./routes/users')

//Declarar la variable para el servidor web
const app = express()

// Inicializar firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

// Middleware
app.use(cors())
app.use(bodyParser.json)

// Decirle a la solucion las rutas
app.use('api/auth', auth)
//app.use('api/users', users)

const PORT = process.env.PORT || 3010
app.listen(PORT, ()=> {
    console.log(`Listen Port: ${PORT}`)
})