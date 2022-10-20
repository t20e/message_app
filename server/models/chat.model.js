const Mongoose = require('mongoose')

const ChatSchema = new Mongoose.Schema({
    members: []
    // [user_id[1], user_id[2], user_id[3], user_id[4]]
    ,
    messages: [],
    // every message will be in an object
    // looks like this 
    // { from: user_id[1], body: 'Hello everyone,  what's up?', date: 10-11-12  },
    status: {
        delete: Boolean,
    }
}, { timestamps: true })

const Chat = Mongoose.model('chat', ChatSchema)
module.exports = Chat