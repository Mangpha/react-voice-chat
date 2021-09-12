import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Chat = (roomName, nickname) => {
    const [message, setMessage] = useState([]);
    const socket = useRef();

    useEffect(() => {
        socket.current = io("http://localhost:4000", { query: { roomName } });
        socket.current.on("newMessage", (newMessage) => {
            console.log("receive data");
            setMessage((message) => [...message, newMessage]);
        });
        socket.current.on("leave", (nickname) => {
            setMessage((message) => [
                ...message,
                { nickname: "Notification", msg: `${nickname} has left` },
            ]);
        });
        return () => {
            socket.current.disconnect();
        };
    }, [roomName]);
    const sendNewMessage = (msg, nickname) => {
        console.log("send msg called");
        socket.current.emit("newMessage", roomName, { msg, nickname });
    };
    return { message, sendNewMessage };
};
export default Chat;
