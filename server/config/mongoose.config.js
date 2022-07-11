const mongoose = require("mongoose")
const dbName = 'message_app_db'

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@personal-projects-db.3ruyg.mongodb.net/${dbName}?retryWrites=true&w=majority`
, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Established a connection to the database'))
    .catch(err => console.log('Something went wrong when connecting to the database ', err));