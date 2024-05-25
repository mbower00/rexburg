const express = require("express")
const app = express()
const portNum = 3000

app.listen(process.env.port || portNum)
console.log(`Server is listening at ${process.env.port || portNum}`)