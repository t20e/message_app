const mongoose = require("mongoose")

mongoose.connect(`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@personal-projects-db.3ruyg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Established a connection to the database'))
    .catch(err => console.log('Something went wrong when connecting to the database ', err));