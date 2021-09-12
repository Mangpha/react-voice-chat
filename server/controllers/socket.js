module.exports = {
    socket: (socket) => {
        const { roomName } = socket.handshake.query;
        socket.join(roomName);

        socket.on("newMessage", (roomName, data) => {
            console.log("receive");
            socket.to(roomName).emit("newMessage", data);
        });
        socket.on("disconnecting", (roomName, nickname) => {
            socket.to(roomName).emit("leave", nickname);
        });
    },
};
