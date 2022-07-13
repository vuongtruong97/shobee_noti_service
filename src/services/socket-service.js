const Filter = require('bad-words')

const socketService = (socket) => {
    console.log('Socket connect establised')

    //socket.emit(...),
    //_io.emit(...),
    //socket.broadcast.emit(...),

    //_io.to(toom).emit(...),
    //socket.broadcast.to(room).emit(...)

    //listen join
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }
        if (user) {
            socket.join(user.room)
            socket.broadcast
                .to(user.room)
                .emit(
                    'notification',
                    generateMessage(`${user.username} has join the room`)
                )
            socket.emit(
                'wellcome',
                generateMessage(`Wellcome ${user.username}`),
                (response) => {}
            )
            _io.to(user.room).emit('room data', {
                room: user.room,
                users: getUserInRoom(user.room),
            })
        }
    })

    socket.on('chat message', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id)
        if (user) {
            _io.to(user.room).emit(
                'chat message',
                generateMessage(filter.clean(message), user.username)
            )
            callback('send all user')
        }
    })

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} has been remove`)
        // const user = removeUser(socket.id)
        // if (user) {
        //     _io.to(user.room).emit(
        //         'notification',
        //         generateMessage(`${user.username} has left the room`)
        //     )
        //     _io.to(user.room).emit('room data', {
        //         room: user.room,
        //         users: getUserInRoom(user.room),
        //     })
        // }
    })
    socket.on('noti', (payload, cb) => {
        console.log(payload)
        console.log(cb)
        console.log('asdfasfsfsdf')
    })
}

module.exports = socketService
