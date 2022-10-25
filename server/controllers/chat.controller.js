const { default: mongoose } = require("mongoose");
const Chat = require("../models/chat.model");
const UserController = require("./user.controller");

const ObjectId = mongoose.Types.ObjectId;
class ChatController {
    getChat = async (req, res) => {
        let arr = []
        req.body.members.map(id => {
            arr.push(ObjectId(id))
        })
        Chat.aggregate(
            [
                {
                    $match: {
                        members: {
                            $all:
                                arr
                        }
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "members",
                        foreignField: "_id",
                        as: "members",
                    }
                }
            ]
        )
            // the $all will get a document by an array but it knows the array isn’t ordered so it will find it by unordered array
            // the document array of members has to match the arr of ids
            .then(chat => {
                if (chat.length > 0) {
                    console.log('found chat')
                    res.json({ 'msg': 'found chat', chat: chat[0] })
                } else {
                    // convert all ids to ObjectIds to pass into the new document
                    req.body.members = req.body.members.map(member => ObjectId(member))
                    Chat.create(req.body)
                        .then(chat => {
                            // add chat id to user chat
                            UserController.addChatToUser(chat._id, req.body.members)
                            Chat.aggregate(
                                [
                                    {
                                        $match: {
                                            _id: chat._id
                                        }
                                    },
                                    {
                                        $lookup:
                                        {
                                            from: "users",
                                            localField: "members",
                                            foreignField: "_id",
                                            as: "members",
                                        }
                                    }
                                ]
                            )
                            .then(newChat =>{
                                res.json({ 'msg': 'no existing chat, created one', 'chat': newChat });
                            })
                            .catch(err => res.json({msg: 'err find a chat that was created from this request', err:err}))
                        })
                        .catch(err => {
                            res.json({ 'msg': 'err creating chat' })
                        })
                }
            })
            .catch(err => {
                res.json({ 'msg': 'err finding chat or creating chat' })
            })

    }
    createMsg = (data) => {
        console.log(data, 'creating new message');
        Chat.findOneAndUpdate({ _id: data.roomId },
            { $push: { messages: data.msg } },
            { new: true, runValidators: true }
        )
            .then(updatedChat => {
                // console.log(updatedChat);
                // res.json({ 'chat': updatedChat })
                return 'created msg'
            })
            .catch(err => {
                return 'err'
                console.log(err)
                // res.json({ msg: 'error adding message' })
            })
    }

    getAllChatsForUser = (req, res) => {
        let arr = []
        req.body.chats_data = req.body.chats_data.map(id => {
            arr.push(ObjectId(id))
        })
        // console.log(req.body.chats_data)
        Chat.aggregate(
            [
                {
                    $match: {
                        _id: {
                            $in:
                                arr
                        }
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "members",
                        foreignField: "_id",
                        as: "usersData",
                    }
                },
                {
                    // only send selected fields from the collections
                    $project: {
                        "usersData.firstName": 1, "usersData.lastName": 1, "usersData._id": 1, "_id": 1, "usersData.profilePic": 1, "isActive": 1,
                        messages: 1
                    }
                }
            ]
        )
            .then(allChats => {
                res.json({ 'results': allChats })
            })
            .catch(err => {
                res.json({ 'err': err });
            })
    }
}
module.exports = new ChatController();