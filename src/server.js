require('dotenv').config()
const express = require('express')
const cors = require('cors')
const socketService = require('./services/socket-service')
const notiService = require('./services/noti-service')
const emailService = require('./services/email-service')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { instrument } = require('@socket.io/admin-ui')

//config server express and socketio
const app = express()
const port = process.env.PORT || 3003
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['https://admin.socket.io', 'http://localhost:3000'],
        credentials: true,
    },
})
instrument(io, {
    auth: false,
})

global._io = io

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// _io.use((socket, next) => {
//     const username = socket.handshake.auth.username
//     console.log('run midle ware')
//     if (!username) {
//         return next(new Error('invalid username'))
//     }
//     socket.username = username
//     next()
// })

// run services
notiService()
emailService()

// socket io
_io.on('connection', socketService)

server.listen(port, () => {
    console.log(`Notification service is running on http://localhost:${port}`)
})
