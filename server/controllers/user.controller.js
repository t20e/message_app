const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const randomstring = require("randomstring");

const bucket_name = process.env.BUCKET_NAME
const bucket_region = process.env.BUCKET_REGION
const access_key_aws_user = process.env.ACCESS_KEY_AWS_USER
const secret_access_key_aws_user = process.env.SECRET_ACCESS_KEY_AWS_USER
// configure s3 bucket
const s3 = new S3Client({
    credentials: {
        accessKeyId: access_key_aws_user,
        secretAccessKey: secret_access_key_aws_user,
    },
    region: bucket_region,

})
class UserController {
    register = async (req, res) => {
        // req.file.buffer      contains the img // everything else in it is just details about the img
        if (req.file) {
            const rand_string = randomstring.generate(32)
            const params = {
                Bucket: bucket_name,
                // TODO the files arent foinf in to the right folder its creating a new folder
                Key: `client/message-app/${rand_string}`,
                Body: req.file.buffer,
                ContentType: req.file.mimtype,
            }
            const command = new PutObjectCommand(params);
            await s3.send(command)
            const data = req.body
            data['profilePic'] = rand_string
            // console.log(data)
        }
        const addUserToDB = await User.find({ email: req.body.email })
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
                                .json({ msg: "successfully created user", 'user': user });
                        })
                        .catch(err => res.json(err));
                } else {
                    res.json({ errors: { email: { message: "Email is taken!" } } })
                }
            })
            .catch(err => console.log("err!", err))
    }
    login = (req, res) => {
        console.log("email:", req.body.email);
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
                                    .json({ msg: 'successfully logged in', 'user': user })
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
    getUsersInChat = (req, res) => {
        console.log(req.body)
        // User.find({ "_id": { "$in": [req.body] } }, { firstName: 1, lastName: 1, _id: 1 })
        // U CAN NOT PASS AN ARRAY OF IDS IT HAS TO BE AN OBJECT OR OTHER
        User.find({ "_id": req.body })
            // User.find({ "_id": {"$in" : ObjectId("6333fb549d7877dd9440233c")} }, { firstName: 1, lastName: 1 })
            .then((users) => {
                // console.log(users)
                if (users.length > 0) {
                    res.json(users);
                } else {
                    res.json({ 'err': 'could not find users' })
                }
            })
            .catch((error) => {
                res.json({ 'err': error })
            })
    }
    // delete user pfp
    updateUser = async (req, res) => {
        // find the user and get their pfp id
        const params = {
            Bucket: bucket_name,
            // Key: the id of the users pfp img
        }
        const command = DeleteObjectCommand(params)
        await S3Client.send(command);
    }
    // then update the user in the mongoDb
}
module.exports = new UserController();
