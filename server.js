// used code from https://www.youtube.com/watch?v=K00J87SofEc
// used code from https://www.youtube.com/watch?v=SBvmnHTQIPY

const passport = require('passport')
const session = require('express-session')

const express = require("express")
const app = express()
const portNum = 3000


// used code from https://www.coderrocketfuel.com/article/store-mongodb-credentials-as-environment-variables-in-nodejs
require("dotenv").config()
// used code from https://nordicapis.com/building-a-restful-api-using-node-js-and-mongodb/
const bp = require("body-parser")

require('./passport.js')(passport)

app.use(bp.json())

app.use(session({
    secret: 'and my father dwelt in a tent',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/index.js'))

app.listen(process.env.port || portNum)
console.log(`Server is listening at ${process.env.port || portNum}`)