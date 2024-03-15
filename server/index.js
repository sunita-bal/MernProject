const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const messageRoute = require('./routes/messages');
const socket = require('socket.io');


const app = express();

dotenv.config({path:'./config.env'});
require('./db/conn');

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoute);

const PORT = process.env.PORT;

const server = app.listen(PORT, ()=>{
    console.log(`Server Startes on Port ${PORT}`);
});

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) =>{
    global.chatSocket = socket,
    socket.on("add-user",(userId) => {
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data) => {
        
        const senderSocketId = socket.id;
        const sendUserSocket = onlineUsers.get(data.io);

        socket.broadcast.emit("msg-receive", data.message);

        if (sendUserSocket && sendUserSocket !== senderSocketId) {
            io.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });
});