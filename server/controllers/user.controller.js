const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


class UserController {
    register = (req, res) => {
        User.find({ email: req.body.email })
            .then(checkEmailDB => {
                console.log("response from MG", checkEmailDB)
                if (checkEmailDB.length === 0) {
                    User.create(req.body)
                        .then(user => {
                            const userToken = jwt.sign({
                                id: user._id,
                            }, process.env.SECRET_KEY);
                            //respond with a cookie called "usertoken" which contains the JWT from above called userTokenJWT AND also respond with json with info abou the user who just got created
                            res
                                .cookie("usertoken", userToken, process.env.SECRET_KEY, {
                                    httpOnly: true
                                })
                                .json({ msg: "successfully created user", user: user });
                        })
                        .catch(err => res.json(err));
                } else {
                    res.json({ errors: { email: { message: "Email is taken!" } } })
                }
            })
            .catch(err => console.log("errr!", err))
    }
    login = (req, res) => {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user == null) {
                    res.json({ msg: "invalid login credentials" })
                } else {
                    bcrypt.compare(req.body.password, user.password)
                        .then(checkPassword => {
                            if (checkPassword) {
                                res
                                    .cookie("userToken", jwt.sign({ _id: user._id }, process.env.SECRET_KEY), { httpOnly: true })
                            } else {
                                res.json({ msg: "invalid login credentials" })
                            }
                        })
                        .catch(err => {
                            res.json({ msg: "invalid login credentials" })
                            console.log(err);
                        })
                }
            })
            .catch(err => {
                res.json({ msg: err })
            })
    }
    searchAllUsers = (req, res) => {
        User.find()
            .then(allUsers => {
                res.json(allUsers)
            })
            .catch(err => {
                res.json({ msg: err })
            })
    }
    searchUsers = async (req, res) => {
        console.log(req.body.searchVal);
            // let results = await User.aggregate([
            //     {
            //         $search: {
            //             index: "autocomplete",
            //             autocomplete: {
            //                 query: req.body.searchVal,
            //                 path: "firstName",
            //                 fuzzy: {
            //                     maxEdits: 1,
            //                 },
            //                 tokenOrder: "sequential",
            //             },
            //         },
            //     },
            //     {
            //         $project: {
            //             firstName: 1,
            //         },
            //     },
            //     {
            //         $limit: 20,
            //     },
            // ]);
            // if (results) {
            //     return res.json({ 'msg': 'hi' })
            // } else {
            //     res.json([]);
            // }
            // res.json({ 'err': error })
            res.json({'msg':`${req.body.searchVal}`})
    }




}

module.exports = new UserController();