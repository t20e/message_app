const UserController = require('../controllers/user.controller')
module.exports = (app)=>{
    app.post("/api/user/register", UserController.register)
    // app.get('/api/user/:id', UserController.getOneUser)
    app.post("/api/user/login", UserController.login);
}