import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "peerjs";

const ChatRoom = (props) => {
    const [newMessage, setNewMessage] = useState("");
    const { roomName } = props.match.params;
    const nickname =
        props.location.state === undefined
            ? "Guest" + Math.floor(Math.random() * 10000)
            : props.location.state.nickname;
    const [messages, setMessages] = useState([]);
    const socket = io(process.env.REACT_APP_HOST, { query: { roomName, nickname } });
    const myPeer = new Peer();

    const audioList = useRef();
    const audioRef = useRef();

    const makeMessage = (msg) => {
        setMessages((message) => [...message, msg]);
    };
    // const [clients, setClientCount] = useState(0);

    const sendNewMessage = (msg, nickname) => {
        socket.emit("newMessage", roomName, { msg, nickname });
    };

    const handleMessageChange = (event) => {
        setNewMessage(event.target.value);
    };
    const handleSendMessage = (e) => {
        sendNewMessage(newMessage, nickname);
        setNewMessage("");
    };
    const onKeyPress = (event) => {
        if (event.key === "Enter") handleSendMessage();
    };
    // const clientCount = () => {
    //     socket.emit("roomClientCount", roomName);
    // };
    // RTC Code

    const addAudioStream = (audio, stream) => {
        audio.srcObject = stream;
        audio.addEventListener("loadedmetadata", () => {
            audio.play();
        });
        audioList.current.append(audio);
    };

    useEffect(() => {
        socket.emit("joinRoom", roomName, nickname, {
            nickname: "Notice",
            msg: `${nickname} join!`,
        });
        // RTC Code
        navigator.mediaDevices
            .getUserMedia({
                audio: { echoCancellation: true },
            })
            .then((stream) => {
                myPeer.on("open", (peerId) => {
                    socket.emit("voiceChat", roomName, nickname, peerId);
                });
                addAudioStream(audioRef.current, stream);
                myPeer.on("call", (call) => {
                    call.answer(stream);
                    const audio = document.createElement("audio");
                    audio.setAttribute("autoPlay", "playsInline");
                    call.on("stream", (userAudio) => {
                        addAudioStream(audio, userAudio);
                    });
                });
                socket.on("userConnect", (peerId) => {
                    const peerCall = myPeer.call(peerId, stream);
                    const audio = document.createElement("audio");
                    peerCall.on("stream", (userAudio) => {
                        addAudioStream(audio, userAudio);
                    });
                    peerCall.on("close", () => {
                        audio.remove();
                    });
                });
            });

        // Message, Socket Code
        socket.on("welcome", (nickname, data) => {
            makeMessage(data);
        });
        socket.on("newMessage", (newMessage) => {
            makeMessage(newMessage);
        });

        socket.on("leave", (nickname) => {
            makeMessage({ nickname: "Notice", msg: `${nickname} has left` });
        });
        // socket.on("roomClientCount", (num) => {
        //     setClientCount(num);
        // });

        return () => {
            socket.disconnect();
        };
    }, [roomName]);

    return (
        <div>
            <h1>Room Name: {roomName}</h1>
            <div>
                {/* <h2>User Count: {clients}</h2> */}
                <ol id="chat-list">
                    {messages.map((el, i) => (
                        <li key={i}>
                            {el.nickname} : {el.msg}
                        </li>
                    ))}
                </ol>
            </div>

            <input
                type="text"
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="input your message"
                onKeyPress={onKeyPress}
            ></input>
            <button onClick={handleSendMessage}>Send</button>
            <div ref={audioList}>
                <audio ref={audioRef} autoPlay muted></audio>
            </div>
        </div>
    );
};
export default ChatRoom;
