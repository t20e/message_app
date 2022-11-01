const ChatController = require('../controllers/chat.controller');
const UserController = require('../controllers/user.controller');
const { emit } = require('../models/chat.model');
module.exports = (io) => {

    let socket_user_ids_obj = new Object();
    // clientInfo.customId         = data.customId;
    // clientInfo.clientId     = socket.id;
    // clients.push(clientInfo);
    io.on("connection", socket => {
        console.log("socket id: " + socket.id);

        socket.on("addUserToObj", (id) => {
            socket_user_ids_obj[id] = socket.id;
            console.log(id);
            console.log("\n socket user obj : ", socket_user_ids_obj)
        })
        // socket.on("setUserActive", (userId, boolean) => {
        //     UserController.setUserActive(userId, boolean);
        // })
        socket.on("join_room", (roomId) => {
            console.log("socket room id:", roomId);
            socket.join(roomId);
            // console.log(socket.rooms);
        })
        socket.on("joinMultRooms", (roomsArr) => {
            socket.join(roomsArr)
            // console.log('\n+++++ all rooms \n', io.sockets.adapter.rooms)
        })
        // TODO maybe it should constantly check to make suer the socket stays in the obj when make a new msg or other check to see if its there
        socket.on("new_msg", async (data) => {
            console.log("creating msg")
            console.log(socket_user_ids_obj)
            let updatedChat = await ChatController.createMsg(data)
            if (!updatedChat._id) {
                io.to(data.roomId).emit("res_msg", ('couldnt add msg to chat please reload page'));
            }
            // console.log(socket.rooms)
            // get the length of all sockets in default main room
            // console.log(io.engine.clientsCount)
            const num_of_socket = await io.in(data.roomId).fetchSockets()
            let check = false
            // check if the user is in the obj then check if hes in room 
            if (socket_user_ids_obj[data.otherUser]) {
                // means user is online
                console.log('user is in the main obj')
                for (const item of num_of_socket) {
                    // console.log('socket ids:', item.id);
                    if (item.id === socket_user_ids_obj[data.otherUser]) {
                        console.log('in room')
                        check = true;
                    }
                }
                // if check is false than user isnt in the room
                if (!check) {
                    console.log('not in room')
                    // emit to specific user
                    const chat = await ChatController.getChatThatWasntAlreadyloaded(data.roomId)
                    io.to(socket_user_ids_obj[data.otherUser]).emit('loadNewChat', chat)
                }
            }
            io.to(data.roomId).emit("res_msg", (data));
        })

        socket.on("typing", (roomId) => {
            socket.to(roomId).emit("typing");
        })
        socket.on("stopped_typing", ({ roomId }) => {
            socket.to(roomId).emit("stopped_typing");
        })

        socket.on('disconnect', () => {
            console.info('Client disconnected');
            // console.log('key in object', Object.keys(socket_user_ids_obj).find(key => socket_user_ids_obj[key] === socket.id))
            const key = Object.keys(socket_user_ids_obj).find(key => socket_user_ids_obj[key] === socket.id)
            delete socket_user_ids_obj[key]
            console.log('delete user from socket because they disconnected ==>', socket_user_ids_obj)
        });
    })
}