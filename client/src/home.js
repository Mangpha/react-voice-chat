import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const homeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Home = () => {
    const [roomName, setRoomName] = useState("");
    const handleRoomName = (event) => {
        setRoomName(event.target.value);
    };
    const [nickname, setNickname] = useState("");
    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };
    return (
        <div>
            <input
                type="text"
                placeholder="Input Room name"
                value={roomName}
                onChange={handleRoomName}
                className="input-room-name"
            />
            <input
                type="text"
                placeholer="Input Your Nickname"
                value={nickname}
                onChange={handleNicknameChange}
            />
            <Link to={{ pathname: `/${roomName}`, state: { nickname } }} className="enter-room">
                Join Room
            </Link>
        </div>
    );
};

export default Home;
