const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000

const users = {}
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    console.log(socket.id)

    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("myId", socket.id);
    io.sockets.emit("currentUsers", users);

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