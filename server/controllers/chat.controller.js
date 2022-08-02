const Chat = require("../models/chat.model");

class ChatController {
    getChat = (req, res) =>{
        res.json({'msg':'hi'})
    }
}
module.exports = new ChatController();