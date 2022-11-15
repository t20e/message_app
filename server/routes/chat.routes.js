const ChatController = require('../controllers/chat.controller')
module.exports = (app) =>{
    app.post("/chatapp/api/chat", ChatController.getChat)
    app.put("/chatapp/api/chat/sendMsg", ChatController.createMsg)
    app.get("/chatapp/api/getAllChatsForUser/:_id", ChatController.getAllChatsForUser)
}