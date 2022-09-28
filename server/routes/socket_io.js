const ChatController = require('../controllers/chat.controller')

module.exports = (io) => {
    io.on("connection", socket => {
        console.log("socket id: " + socket.id);;

        socket.on("join_room", (roomId) => {
            console.log("socket room id:", roomId);
            socket.join(roomId);
            // console.log(socket.rooms);
        })

        socket.on("new_msg", (data) => {
            console.log(`room: ${data.roomId}, message: ${data.body}`)
            let createMsg = ChatController.createMsg(data)
            // if(createMsg.err){
            //     console.log('err creating msg')
            // }
            io.to(data.roomId).emit("res_msg", (data.body));
        })

        socket.on("typing", (roomId) => {
            socket.to(roomId).emit("typing");
        })
        socket.on("stopped_typing", ({ roomId }) => {
            socket.to(roomId).emit("stopped_typing");
        })

        // io.emit("welcome", {msg:"welcome msg"}) 

        socket.on('disconnect', () => {
            console.info('Client disconnected');
        });
    })
}