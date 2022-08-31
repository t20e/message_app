const UserController = require('../controllers/user.controller')
const { authenticate } = require('../config/jwt.config')

module.exports = (app)=>{
    // app.get("/api/users", authenticate, getAllUsers)
    app.post("/api/user/register", UserController.register);
    app.post("/api/user/login", UserController.login);
    app.get("/api/searchAllUsers", UserController.searchAllUsers);
    app.get("/api/searchUsers", UserController.searchUsers)
    app.get("/api/user/logUser", UserController.getLoggedUser)
    app.get("/api/user/logout", UserController.logout)
}