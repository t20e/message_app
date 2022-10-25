const ChatController = require('../controllers/chat.controller');
const UserController = require('../controllers/user.controller');
let userId;
module.exports = (io) => {
    io.on("connection", socket => {
        console.log("socket id: " + socket.id);;

        socket.on("setUserActive", (_id) => {
            UserController.setUserActive(_id, true);
            userId = _id;
        })

        socket.on("join_room", (roomId) => {
            console.log("socket room id:", roomId);
            socket.join(roomId);
            // console.log(socket.rooms);
        })

        socket.on("new_msg", (data) => {
            console.log("creating msg")
            let createMsg = ChatController.createMsg(data)
            // if ('err' in createMsg) {
            //     console.log('err creating msg')
            // }
            io.to(data.roomId).emit("res_msg", (data));
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
            UserController.setUserActive(userId, false);
        });
    })
}