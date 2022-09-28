const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
class UserController {
    register = (req, res) => {
        User.find({ email: req.body.email })
            .then(checkEmailDB => {
                console.log("response from mongoose", checkEmailDB)
                if (checkEmailDB.length === 0) {
                    User.create(req.body)
                        .then(user => {
                            console.log(user.firstName);
                            //respond with a cookie called "usertoken" which contains the JWT from above called userTokenJWT AND also respond with json with info about the user who just got created
                            res
                                .cookie("userToken", jwt.sign({
                                    _id: user._id,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }, process.env.SECRET_KEY), {
                                    httpOnly: true
                                })
                                .json({ msg: "successfully created user", 'user':user });
                        })
                        .catch(err => res.json(err));
                } else {
                    res.json({ errors: { email: { message: "Email is taken!" } } })
                }
            })
            .catch(err => console.log("err!", err))
    }
    login = (req, res) => {
        console.log("email:",req.body.email);
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user === null) {
                    res.json({ msg: "invalid login credentials" })
                } else {
                    bcrypt.compare(req.body.password, user.password)
                        .then(checkPassword => {
                            if (checkPassword) {
                                res
                                    .cookie("userToken", jwt.sign({
                                        _id: user._id,
                                        firstName: user.firstName,
                                        lastName: user.lastName
                                    }, process.env.SECRET_KEY), { httpOnly: true })
                                    .json({ msg: 'successfully logged in', 'user':user })
                            } else {
                                res.json({ msg: "invalid login credentials" })
                            }
                        })
                        .catch(err => {
                            res.json(err)
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                res.json({ msg: err })
            })
    }

    logout = (req, res) => {
        res.clearCookie('userToken');
        res.sendStatus(200);
    }
    getLoggedUser = (req, res) => {
        const decodedJWT = jwt.decode(req.cookies.userToken, { complete: true })
        // console.log("cookie user is:", decodedJWT.payload._id);
        User.findOne({ _id: decodedJWT.payload._id })
            .then(user => {
                res.json({ results: user })
            })
            .catch(err => {
                res.json(err)
            })
    }
    searchAllUsers = (req, res) => {
        // filter to return only necessary info such as id firstName lastName
        User.find({}, { "_id": 1, "firstName": 1, "lastName": 1 })
            .then(allUsers => {
                res.json(allUsers)
            })
            .catch(err => {
                res.json({ msg: err })
            })
    }
    searchUsers = async (req, res) => {
        console.log(req.body.searchVal);
        let results = await User.aggregate([
            {
                $search: {
                    index: "autocomplete",
                    autocomplete: {
                        query: req.body.searchVal,
                        path: "firstName",
                        fuzzy: {
                            maxEdits: 1,
                        },
                        tokenOrder: "sequential",
                    },
                },
            },
            {
                $project: {
                    firstName: 1,
                },
            },
            {
                $limit: 20,
            },
        ]);
        if (results) {
            return res.json({ 'msg': 'hi' })
        } else {
            res.json([]);
        }
        res.json({ 'err': error })
        res.json({ 'msg': `${req.body.searchVal}` })
    }
    getAllUsers = (req, res) => {
        User.find()
    }
}
module.exports = new UserController();
