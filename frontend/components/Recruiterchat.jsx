import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); 

const RecruiterChat = () => {
    const receiverId = "job5678"; // Example JobSeeker ID
    const userId = "rec1234"; // Example Recruiter ID

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.emit("registerUser", userId); // Register recruiter on server

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => socket.off("receiveMessage");
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("sendMessage", { senderId: userId, receiverId, message });
            setMessages((prev) => [...prev, { senderId: userId, message }]);
            setMessage("");
        }
    };

    return (
        <div>
            <h2>Recruiter Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index} style={{ color: msg.senderId === userId ? "blue" : "green" }}>
                        {msg.message}
                    </p>
                ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default RecruiterChat;
