const express = require('express');
const cors = require('cors') 
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

require('./server/routes/user.routes')(app)
require('./server/config/mongoose.config')

app.listen(port, () => {
    console.log("Listening at Port 8000")
})


