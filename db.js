// used code from https://www.youtube.com/watch?v=SBvmnHTQIPY

const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        // used code from https://blog.logrocket.com/handle-data-validation-node-js-validatorjs/
        const conn = await mongoose.connect(process.env.CONNECTION_STRING, {})

        console.log(`MongoDB Connected`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB