const UserController = require('../controllers/user.controller')
// multer is the package that allows express to read and use imgs received from the frontend
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


module.exports = (app) => {
    // the upload.single('profilePic) allows to send a single imgs, this wont allow u to send more than one imgs 
    // then name inside ex profilePic needs to match whatever u named the img in the obj
    app.post("/api/user/register", upload.single('profilePic'), UserController.register);
    app.post("/api/user/login", UserController.login);
    app.get("/api/user/logUser", UserController.getLoggedUser)
    app.get("/api/user/logout", UserController.logout)
    app.post("/api/usersInChat", UserController.getUsersInChat)
    app.put("/api/users/update/:_id",  upload.single('profilePic'), UserController.updateUser)
    app.get("/api/searchUsers/:name", UserController.searchAllUsers);
    
}