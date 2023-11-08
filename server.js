const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const Home = require("./routes/home")
const UserRoute = require("./routes/userRouter")
const PostRoute = require("./routes/postRouter")
const CommentRoute = require("./routes/commentRoute")
const Register = require("./routes/register")
const Auth = require("./routes/authRoutes")

const corsOptions = require('./config/corsOptions')
const connectDb = require('./config/dbConnection')

const PORT = process.env.PORT || 8000;

require('dotenv').config()
app.use(logger)
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

connectDb()
app.use((_req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'https://expressspot.netlify.app/');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    next();
});
app.use("/", Home)

app.use("/auth", Auth)
app.use("/user", UserRoute)
app.use("/posts", PostRoute)
app.use("/comments", CommentRoute)
app.use("/register", Register)

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views/404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('text').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connect to Mongoose')
})

app.listen(PORT, () => {
    console.log(`started on ${PORT}`)
})

mongoose.connection.on('error', (err) => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})