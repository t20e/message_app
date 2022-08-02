const ChatController = require('../controllers/chat.controller')
module.exports = (app) =>{
    app.get("/api/chat/getChat", ChatController.getChat)
}