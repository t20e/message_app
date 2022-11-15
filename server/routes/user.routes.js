const UserController = require('../controllers/user.controller')
// multer is the package that allows express to read and use imgs received from the frontend
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


module.exports = (app) => {
    // the upload.single('profilePic) allows to send a single imgs, this wont allow u to send more than one imgs 
    // then name inside ex profilePic needs to match whatever u named the img in the obj
    app.post("/chatapp/api/user/register", upload.single('profilePic'), UserController.register);
    app.post("/chatapp/api/user/login", UserController.login);
    app.get("/chatapp/api/user/logUser", UserController.getLoggedUser)
    app.get("/chatapp/api/user/logout", UserController.logout)
    app.put("/chatapp/api/users/update/:_id",  upload.single('profilePic'), UserController.updateUser)
    app.get("/chatapp/api/searchUsers/:name", UserController.searchAllUsers);
    app.get("/chatapp/api/users/logout", UserController.logout)
}