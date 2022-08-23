const Chat = require("../models/chat.model");

class ChatController {
    createChat = (req, res)=>{
        console.log(req.body);
        Chat.create(req.body)
        .then(newChat => {
            res.json({'newChat':'hi'})
        })
        .catch(err => res.json(err));
    }
    getChat = (req, res) =>{
    }
    createMsg = (req, res)=>{

    }
}
module.exports = new ChatController();