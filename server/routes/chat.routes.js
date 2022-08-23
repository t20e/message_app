const ChatController = require('../controllers/chat.controller')
module.exports = (app) =>{
    app.get("/api/chat/getChat", ChatController.getChat)
    // app.post("/api/chat/sendMsg", ChatController.createMsg)
    app.post("/api/chat/create", ChatController.createChat)
}