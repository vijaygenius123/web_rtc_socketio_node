const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000

const users = {}
app.get('/', (req, res) => {
    res.send('<h1>Web RTC Signalling</h1>');
});

io.on('connection', (socket) => {
    console.log(socket.id)

    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("myId", socket.id);
    io.sockets.emit("allUsers", users);

    socket.on('disconnect', () => {
        delete users[socket.id];
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })

});


http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});