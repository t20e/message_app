const { default: mongoose } = require("mongoose");
const Chat = require("../models/chat.model");
const { collection } = require("../models/user.model");
const User = require("../models/user.model");
const ObjectId = require('mongodb').ObjectId;
class ChatController {
    getChat = async (req, res) => {
        req.body.members = req.body.members.map(member => ObjectId(member))
        console.log(req.body.members, 'here')
        Chat.aggregate(
            [
                {
                    $match: {
                        members: {
                            //$in vs $all
                            $all:
                                req.body.members
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
                    // { 'members': users }
                    req.body['typeAction'] = "false"
                    // data = { 'members': req.body.members[0].members, 'typeAction': 'false' }
                    Chat.create(req.body)
                        .then(chat => {
                            console.log(chat)
                            // add chat id to user chat
                            this.addChatToUser(chat._id, req.body.members)
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
                                .then(newChat => {
                                    res.json({ 'msg': 'no existing chat, created one', 'chat': newChat[0] });
                                })
                                .catch(err => res.json({ msg: 'err find a chat that was created from this request', err: err }))
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
    createMsg = async (data) => {
        // console.log(data, 'creating new message');
        const updatedChat = await Chat.findOneAndUpdate({ _id: data.roomId },
            { $push: { messages: data.msg } },
            { new: true, runValidators: true }
        )
        return updatedChat
    }
    getChatThatWasntAlreadyloaded = async (chatId) => {
        // this is for when a user send a msg to another user and that user is online but loaded his page before this chat was created
        console.log(chatId)
        const chat = await Chat.aggregate(
            [
                {
                    $match: {
                        _id: ObjectId(chatId)
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
        console.log('chat in controller', chat)
        if (chat.length > 0) {
            return chat[0]
        } else {
            return { 'err': "server couldn't find chat" }
        }
    }

    createChatWIthNewUserForBot = async (user_id) => {
        let collectionOne = {
            members: [ObjectId("636d7cd51d82d9e9782d2148"), user_id],
            messages: [
                {
                    body: "hey bot here! chat with me. I can tell you the weather in your area, a riddle, a crypto price, or the current time",
                    from: "636d7cd51d82d9e9782d2148",
                    timeStamp: this.getCurrTime()
                }
            ],
            typeAction: false
        }
        let collectionTwo = {
            members: [ObjectId("636d7e82c49bd25d1264a813"), user_id],
            messages: [
                {
                    body: "hi, thanks for visiting my site",
                    from: "636d7e82c49bd25d1264a813",
                    timeStamp: this.getCurrTime()
                }
            ],
            typeAction: false
        }
        const createChats = await Chat.insertMany([collectionOne, collectionTwo])
        // console.log('\ncreated chat with new user, chats:', createChats)
        for (const chat of createChats) {
            // add the chats to the bot and me collections
            if (chat.members.includes("636d7e82c49bd25d1264a813")) {
                // console.log("/n/n im am here")
                await this.addChatToUser(chat._id.toString(), [ObjectId("636d7e82c49bd25d1264a813"), user_id])
            } else if (chat.members.includes("636d7cd51d82d9e9782d2148")) {
                // console.log("/n/n bot is here")
                await this.addChatToUser(chat._id.toString(), [ObjectId("636d7cd51d82d9e9782d2148"), user_id])
            }
        }
        return;
    }
    addChatToUser = async (chatId, members) => {
        let update = await User.updateMany({ _id: members },
            { $push: { allChats: chatId } })
        // console.log('updated users chat \n', update)
        return;
    }


    getAllChatsForUser = async (req, res) => {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        // console.log(fullUrl)
        const chats = await User.findOne({ _id: req.params._id }, { _id: 0, allChats: 1 })
        // console.log(allChats)
        let arr = []
        chats.allChats.map(id => {
            arr.push(ObjectId(id))
        })
        // console.log('arr', arr)
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
                        as: "members",
                    }
                },
                // {
                //     // only send selected fields from the collections
                //     $project: {
                //         "usersData.firstName": 1, "usersData.lastName": 1, "usersData._id": 1, "_id": 1, "usersData.profilePic": 1, "isActive": 1,
                //         messages: 1
                //     }
                // }
            ]
        )
            .then(allChats => {
                // console.log("chats found ===>", allChats);
                res.json({ 'results': allChats })
            })
            .catch(err => {
                res.json({ 'err': err });
            })
    }
    getCurrTime = () => {
        const date = new Date();
        const yyyy = (date.getFullYear());
        const mm = (date.getMonth() + 1);
        const dd = (date.getUTCDate() - 1);
        const hr = (date.getHours())
        const min = (date.getMinutes())
        // date = mm + '-' + dd + '-' + yyyy+ '-' + time;
        const timeStamp = { "year": yyyy, "month": mm, "day": dd, "hour": hr, "min": min }
        return timeStamp
    }
}
module.exports = new ChatController();