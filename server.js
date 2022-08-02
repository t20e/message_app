const { Server } = require("socket.io");
// const io = new Server(3000,{})
const express = require('express');
const cors = require('cors') 
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}));

require('./server/config/mongoose.config')
require('./server/routes/user.routes')(app)
require('./server/routes/chat.routes')(app)
// require('./server/routes/socket_io')(io)

app.listen(port, () => {
    console.log("Listening at Port 8000")
})

// io.on("connection", (socket) =>{
//     console.log(socket, 'hi');
// })