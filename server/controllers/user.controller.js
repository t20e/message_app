const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const randomstring = require("randomstring");

const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const chatController = require("./chat.controller");
const { response } = require("express");



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
    getSignedUrlS3 = async () => {
        // NOT applicable to this project i want to get something like an access token that will expire in specified time
        //the signed url needs to be sign for each image. the css has background img
        // const getObjectParams = {
        //     Bucket: bucket_name,
        //     Key: 'app/icons/bot_janel.svg'
        // }
        // const command = new GetObjectCommand(getObjectParams);
        // const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        // console.log('\n\n signed url:', url)
        // return {url:url}
    }
    addPfpToAws = (file) => {
        console.log(file, 'file')
        console.log(file.type)
        const rand_string = randomstring.generate(32)
        const params = {
            Bucket: bucket_name,
            Key: `client/message-app/${rand_string}`,
            Body: file.buffer,
            ContentType: file.mimtype,
        }
        const command = new PutObjectCommand(params);
        s3.send(command)
        return rand_string;
    }

    addNewUserChat = (chatArr, members) => {
        // this is when a new user joins and automatically joins a chat with me and a bot, the func above only takes one chat id i cant use it for this
    }

    deletePfpFromAws = (id) => {
        try {
            const params = {
                Bucket: bucket_name,
                Key: `client/message-app/${id}`
            }
            const command = new DeleteObjectCommand(params)
            s3.send(command);
        } catch (err) {
            console.log("Error", err);
        }
    }
    register = async (req, res) => {
        // req.file.buffer      contains the img // everything else in it is just details about the img
        if (req.file) {
            req.body['profilePic'] = await this.addPfpToAws(req.file)
        } else {
            delete req.body['profilePic']
        }
        const checkEmailDB = await User.find({ email: req.body.email })
        // console.log('\ncheck email', checkEmailDB)
        if (checkEmailDB.length === 0) {
            let newUser
            try {
                //create a new user
                newUser = await User.create(req.body)
                // console.log('\n new user:', newUser)
            } catch (error) {
                return res.json({ msg: "err creating user", err: error })
            }
            //create chats and add it to the user
            const createChats = await chatController.createChatWIthNewUserForBot(newUser._id)
            // TODO if createdChats  has errors return 
            let response = await User.find({ _id: newUser._id })
            // respond with a cookie called "usertoken" which contains the JWT from above called userTokenJWT AND also respond with json with info about the user who just got created
            let findUpdatedUser = response[0]
            res
                .cookie("userToken", jwt.sign({
                    _id: findUpdatedUser._id,
                    firstName: findUpdatedUser.firstName,
                    lastName: findUpdatedUser.lastName
                }, process.env.SECRET_KEY), {
                    httpOnly: true
                })
                .json({ msg: "successfully created user", 'user': findUpdatedUser });
        } else {
            //res.json({ 'msg': 'err getting updated user', err: error })
            //res.json({ msg: "err creating user", err: error })
            //res.json("err trying checking if email exists!", error)
            res.json({ err: { errors: { email: { message: "Email is taken!" } } } })
        }
    }
    deleteManyUsers = (req, res) => {

    }
    login = (req, res) => {
        console.log("email:", req.body.email);
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user === null) {
                    res.json({ err: { errors: { loginFail: { message: "invalid login credentials" } } } })
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
                                res.json({ err: { errors: { loginFail: { message: "invalid login credentials" } } } })
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
        if (decodedJWT !== null) {
            User.findOne({ _id: decodedJWT.payload._id })
                .then(user => {
                    res.json({ results: user })
                })
                .catch(err => {
                    res.json(err)
                })
        } else {
            res.json({ 'err': 'getting loaded user from payload' })
        }
    }
    searchAllUsers = (req, res) => {
        User.aggregate([
            {
                "$search": {
                    "autocomplete": {
                        "query": `${req.params.name}`,
                        "path": "firstName",
                        // fuzzy allow typos etc its very flexible
                        "fuzzy": {
                            "maxEdits": 1
                        }
                    }
                }
            }
        ])
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                res.json({ err: err })
            });
    }

    getAllUsers = (req, res) => {
        User.find()
    }
    setUserActive = (_id, boolean) => {
        User.findOneAndUpdate(
            { _id: _id },
            [{ $set: { isActive: boolean } }]
        )
            .then((data) => {
                // console.log('set User active', data);
            })
            .catch((err) => { console.log('set User active err', err); });
    };


    updateUser = async (req, res) => {
        // TODO the password and confirm password arent being compared when updating user
        if (req.file && req.body.pfpId.length !== 32) {
            // this means that the user doesnt already have a pfp and they uploaded a new one
            req.body['profilePic'] = await this.addPfpToAws(req.file)
        } else if (req.file && req.body.pfpId.length === 32) {
            // this mean that the user has a pfp and it needs to be updated
            await this.deletePfpFromAws(req.body.pfpId);
            req.body['profilePic'] = await this.addPfpToAws(req.file)
        }
        if (req.body.pfpId) {
            delete req.body['pfpId']
        }
        if (req.body.email) {
            res.json({ msg: 'can not change email address' })
        }
        req.body.address = JSON.parse(req.body.address)
        console.log(req.body);
        User.findByIdAndUpdate(
            { _id: req.params._id },
            req.body,
            // the new will return the new updated user instead of the old
            { new: true, runValidators: true, context: 'query' }
            // {context: ‘query'} allows the validator to use the this keyword
        )
            .then(updatedUser => {
                res.json({ result: updatedUser })
            })
            .catch(err => {
                res.json({ error: err, msg: 'err updating User' })
            })

    }
    logout = (req, res) => {
        res.clearCookie('userToken');
        res.sendStatus(200);
    }
}

module.exports = new UserController();
