const ChatController = require('../controllers/chat.controller')
module.exports = (app) =>{
    app.post("/api/chat", ChatController.getChat)
    app.put("/api/chat/sendMsg", ChatController.createMsg)
    app.get("/api/getAllChatsForUser/:_id", ChatController.getAllChatsForUser)
}