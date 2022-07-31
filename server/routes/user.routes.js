const UserController = require('../controllers/user.controller')
module.exports = (app)=>{
    app.post("/api/user/register", UserController.register);
    app.post("/api/user/login", UserController.login);
    app.get("/api/searchAllUsers", UserController.searchAllUsers);
    app.get("/api/searchUsers", UserController.searchUsers)
}