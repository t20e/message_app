const ChatController = require('../controllers/chat.controller')
module.exports = (app) =>{
    app.post("/api/chatapp/chat", ChatController.getChat)
    app.put("/api/chatapp/chat/sendMsg", ChatController.createMsg)
    app.get("/api/chatapp/getAllChatsForUser/:_id", ChatController.getAllChatsForUser)
}