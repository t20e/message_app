const express = require('express');
const cors = require('cors') 
const cookieParser = require('cookie-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
        credentials:true,
        methods: ["GET", "Post"]
    }
})
const port = 8000;
require('dotenv').config();
app.use(express.json())
app.use(express.urlencoded({extended:true})) 
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// can set cors origin to '*' for all origins have access or 'http://localhost:3000' etc
app.use(cookieParser());

require('./server/config/mongoose.config')
require('./server/routes/user.routes')(app)
require('./server/routes/chat.routes')(app)
// require('./server/routes/socket_io')(io)


io.on("connection", socket =>{
    console.log("socket id: " + socket.id);;

    socket.on("join_room", (roomId) =>{
        console.log("socket room id:" , roomId);
            socket.join(roomId);
            // console.log(socket.rooms);
    })
    
    socket.on("new_msg", (data) =>{
        // console.log(data)
        console.log(`room: ${data.roomId}, message: ${data.message}`)
        // io.in('game').emit("res_msg", {
        //     "msg": data.message
        // })
        socket.to(data.roomId).emit("res_msg",{
            "msg": data.message
        });
    })

    socket.on("typing", (roomId)=>{
        socket.to(roomId).emit("typing");
    })
    socket.on("stopped_typing", ({roomId})=>{
        socket.to(roomId).emit("stopped_typing");
    })

    // io.emit("welcome", {msg:"welcome msg"}) 
    
    socket.on('disconnect', () => {
        console.info('Client disconnected');
      });
})
httpServer.listen(port, () => {
    console.log("Listening at Port 8000")
})