const Chat = require("../models/chat.model");
const { login } = require("./user.controller");
const UserController = require('../controllers/user.controller')

class ChatController {
    getChat = (req, res) => {
        Chat.find({ members: { $all: req.body.members } })
            // the $all will get a document by an array but it knows the array isn’t ordered so it will find it by unordered array
            .then(chat => {
                if (chat[0]['_id']) {
                    res.json({ 'msg': 'found chat', chat: chat[0] })
                }
            })
            .catch(err => {
                Chat.create(req.body)
                    .then(chat => {
                        res.json({ 'msg': 'no existing chat, created one', 'chat': chat })
                    })
                    .catch(err => {
                        res.json({ 'msg': 'err creating chat' })
                    })
                // res.json({ 'msg': 'err finding chat' })
            })

    }
    createMsg = (data) => {
        // console.log(data);
        Chat.findOneAndUpdate({ _id: data.roomId },
            { $push: { messages: data.body } },
            { new: true, runValidators: true }
        )
            .then(updatedChat => {
                // console.log(updatedChat);
                // res.json({ 'chat': updatedChat })
            })
            .catch(err => {
                return { 'err': err }
                // res.json({ msg: 'error adding message' })
            })
    }

    getAllChatsForUser = (req, res) => {
        Chat.find({ members: { $all: [req.body._id] } })
            .then(allChats => {
                UserController.getUsersInChat(req, res, allChats)
                // let users = [{}]
                // for(let i in allChats) {
                //     console.log(users[i].members)
                // }
                // res.json({ 'results': allChats })
            })
            .catch(err => {
                res.json({ 'err': err });
            })
    }
}
module.exports = new ChatController();