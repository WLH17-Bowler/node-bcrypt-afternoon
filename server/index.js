require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const auth = require('./controllers/authCtrl')
const treasure = require('./controllers/treasureCtrl')
const authMid = require('./middleware/authMiddleware')

const {SESSION_SECRET, CONNECTION_STRING, SERVER_PORT} = process.env

const app = express()

app.use(express.json())


app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
}))

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('DB pulse')
    app.listen(SERVER_PORT, () => console.log(`SERVER pulse ${SERVER_PORT}`))
}).catch(err => console.log(err))

// ENDPOINTS
app.post('/auth/register', auth.register)
app.post('/auth/login', auth.login)
app.get('/auth/logout', auth.logout)
app.get('/api/treasure/dragon', treasure.dragonTreasure)
app.get('/api/treasure/user', authMid.usersOnly, treasure.getUserTreasure)
app.post('/api/treasure/user', authMid.usersOnly, treasure.addUserTreasure)
app.get('/api/treasure/all', auth.authMid.usersOnly, authMid.adminsOnly, treasure.getAllTreasure)