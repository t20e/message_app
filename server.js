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
        credentials: true,
        methods: ["POST", "GET"]
    }
})
const port = process.env.PORT || 8000;
require('dotenv').config();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// can set cors origin to '*' for all origins have access or 'http://localhost:3000' etc
app.use(cookieParser());

require('./server/config/mongoose.config')
require('./server/routes/user.routes')(app)
require('./server/routes/chat.routes')(app)
require('./server/routes/socket_io')(io)


httpServer.listen(port, async () => {
    console.log("Listening at Port 8000")
})