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
    addPfpToAws = (file) => {
        const rand_string = randomstring.generate(32)
        const params = {
            Bucket: bucket_name,
            // TODO the files arent foinf in to the right folder its creating a new folder
            Key: `client/message-app/${rand_string}`,
            Body: file.buffer,
            ContentType: file.mimtype,
        }
        const command = new PutObjectCommand(params);
        s3.send(command)
        return rand_string;
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
                        .catch(err => res.json({ err: err }));
                } else {
                    res.json({ err: { email: { message: "Email is taken!" } } })
                }
            })
            .catch(err => {
                console.log("err!", err)
                res.json({ err: err })
            });
    }
    login = (req, res) => {
        console.log("email:", req.body.email);
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user === null) {
                    res.json({ err: "invalid login credentials" })
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
                                res.json({ err: "invalid login credentials" })
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
                res.status(500).send({ message: err.message })
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
                console.log('set User active', data);
            })
            .catch((err) => { console.log('set User active err', err); });
    };
    getUsersInChat = (req, res) => {
        console.log(req.body)
        User.find({ _id: req.body }, {isActive: 1, firstName:1, lastName:1, profilePic:1})
            .then((users) => {
                res.json(users)
            })
            .catch((err) => {
                console.error(err)
                res.json({ err: err })
            });
    }

    updateUser = async (req, res) => {
        // TODO the password and confirm password arent being compared
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
}
module.exports = new UserController();
