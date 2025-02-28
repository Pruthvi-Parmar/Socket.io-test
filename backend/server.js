import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const chatSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

// Store active users
const users = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Listen for user registration (identify jobseeker/recruiter)
  socket.on("registerUser", (userId) => {
    users[userId] = socket.id;
    console.log(`User registered: ${userId} -> ${socket.id}`);
  });

  // Listen for messages
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    console.log(`Message from ${senderId} to ${receiverId}: ${message}`);

    // Save to database
    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();

    // Find receiver's socket ID
    const receiverSocketId = users[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", newMessage);
      console.log(`Message sent to ${receiverId}`);
    } else {
      console.log(`User ${receiverId} is not online.`);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        console.log(`User disconnected: ${userId}`);
        delete users[userId];
        break;
      }
    }
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
