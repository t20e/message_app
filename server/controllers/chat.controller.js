const Chat = require("../models/chat.model");
const { login } = require("./user.controller");

class ChatController {
    getChat = (req, res) => {
        Chat.find({ members: { $all: req.body.members } })
            // the $all will get a document by the array but it knows the array inst ordered so it will work if the index are different
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
    createMsg = (req, res) => {
        console.log(req.body);
        Chat.findOneAndUpdate({ _id: req.body.chatId },
            { $push: { messages: req.body.message } },
            { new: true, runValidators: true }
        )
            .then(updatedChat => {
                console.log(updatedChat);
                res.json({ 'chat': updatedChat })
            })
            .catch(err => {
                res.json({ msg: 'error adding message' })
            })
    }
}
module.exports = new ChatController();