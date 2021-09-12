const express = require("express");
const cors = require("cors");
const http = require("http");

// const router = require("./router/index")
const app = express();
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    },
});
app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["authentication"],
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/', router);

io.on("connection", (socket) => {
    // const { roomName } = socket.handshake.query;
    // socket.join(roomName);
    socket.on("joinRoom", (roomName, nickname, data) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome", nickname, data);
    });
    socket.on("voiceChat", (roomName, nickname, peerId) => {
        socket.broadcast.to(roomName).emit("userConnect", peerId);
        socket.on("disconnect", () => {
            socket.broadcast.to(roomName).emit("userDisconnect", peerId);
        });
    });
    socket.on("newMessage", (roomName, data) => {
        socket.to(roomName).emit("newMessage", data);
    });
});

httpServer.listen(4000);
