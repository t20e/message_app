const UserController = require('../controllers/user.controller')
// multer is the package that allows express to read and use imgs received from the frontend
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


module.exports = (app) => {
    // the upload.single('profilePic) allows to send a single imgs, this wont allow u to send more than one imgs 
    // then name inside ex profilePic needs to match whatever u named the img in the obj
    app.post("/api/chatapp/user/register", upload.single('profilePic'), UserController.register);
    app.post("/api/chatapp/user/login", UserController.login);
    app.get("/api/chatapp/user/logUser", UserController.getLoggedUser)
    app.get("/api/chatapp/user/logout", UserController.logout)
    app.put("/api/chatapp/users/update/:_id",  upload.single('profilePic'), UserController.updateUser)
    app.get("/api/chatapp/searchUsers/:name", UserController.searchAllUsers);
    app.get("/api/chatapp/users/logout", UserController.logout)
}