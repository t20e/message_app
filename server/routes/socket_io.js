const ChatController = require('../controllers/chat.controller');
const request = require('request');

let socket_user_ids_obj = new Object();// obj{user_id : socket.id}
const getActiveUsersArr = () => {
    let arr = []
    for (let user in socket_user_ids_obj) {
        arr.push(user)
    }
    return arr
}
module.exports = (io) => {
    io.on("connection", socket => {
        console.log("socket id: " + socket.id);

        socket.on("addUserToObj", (id) => {
            socket_user_ids_obj[id] = socket.id;
            console.log(id);
            console.log("\n socket user obj : ", socket_user_ids_obj)
        })

        socket.on('getActiveUsers', () => {
            console.log('getting active users server')
            io.emit('res_active_users', getActiveUsersArr())
        })

        socket.on("join_room", (roomId) => {
            console.log("socket room id:", roomId);
            socket.join(roomId);
            // console.log(socket.rooms);
        })
        socket.on("joinMultRooms", (roomsArr) => {
            socket.join(roomsArr)
            // console.log('\n+++++ all rooms \n', io.sockets.adapter.rooms)
        })
        socket.on("new_msg", async (data) => {
            console.log("creating msg", data)
            // console.log(socket_user_ids_obj)
            let updatedChat = await ChatController.createMsg(data)
            if (data.is_bot) {
                io.to(data.roomId).emit("res_msg", (data));
                if (!updatedChat._id) {
                    io.to(data.roomId).emit("res_msg", ('could not add msg to chat with bot, please reload page'));
                }
                let url = `${process.env.CHAT_BOT_URL}/?user_id=${data.otherUser}&chat_id=${data.roomId}&msg=${data.msg.body}`
                console.log(url);
                request(url, (error, response, body) => {
                    // console.log('statusCode:', response && response.statusCode);
                    // console.log('body:', body);
                    if (error) {
                        console.error('error:', error);
                        io.to(data.roomId).emit("res_msg", ({ 'err': 'please reload page err chatting with bot' }));
                    } else {
                        res = JSON.parse(body)
                        console.log('\n\nres:', res)
                        data.msg.from = data.otherUser
                        data.msg.body = res.msg;
                        if (res['err']) {
                            data.msg.body = res['err']
                        }
                        let updateChatwithTheBotsMsg = ChatController.createMsg(data)
                        io.to(data.roomId).emit("res_msg", (data));
                    }
                })
            } else {
                if (!updatedChat._id) {
                    io.to(data.roomId).emit("res_msg", ('couldnt add msg to chat please reload page'));
                }
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
            }
        })

        socket.on("typing", (roomId) => {
            console.log(roomId);
            socket.to(roomId).emit("userTyping");
        })
        socket.on("stopped_typing", (roomId) => {
            console.log('\nroomID:', roomId);
            socket.to(roomId).emit("user_stopped_typing");
        })

        socket.on('disconnect', () => {
            console.info('Client disconnected');
            // console.log('key in object', Object.keys(socket_user_ids_obj).find(key => socket_user_ids_obj[key] === socket.id))
            const key = Object.keys(socket_user_ids_obj).find(key => socket_user_ids_obj[key] === socket.id)
            delete socket_user_ids_obj[key]
            console.log('delete user from socket because they disconnected ==>', socket_user_ids_obj)
            socket.broadcast.emit('res_active_users', getActiveUsersArr());
        });
    })
}