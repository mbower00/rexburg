// used code from https://www.coderrocketfuel.com/article/store-mongodb-credentials-as-environment-variables-in-nodejs
// used code from https://www.youtube.com/watch?v=K00J87SofEc
// used code from https://www.mongodb.com/developer/languages/javascript/node-crud-tutorial/
// used code from https://stackoverflow.com/questions/34095126/express-router-id
// used code from https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
// used code from https://www.youtube.com/watch?v=S0przpEKKGU
// used code from https://blog.logrocket.com/handle-data-validation-node-js-validatorjs/

const m = require('mongodb')

async function getClient() {
    const {MongoClient} = require('mongodb')
    const client = new MongoClient(process.env.CONNECTION_STRING)
    try {
        await client.connect()
        return client
    } catch (error) {
        console.log(error)
        return
    }
}

function validatePost(keysArray, data) {
    if (typeof data != 'object') {
        return false
    }

    let dataKeys = []
    for (i in data) {
        dataKeys.push(i)
    }

    let doKeysMatch = keysArray.length == dataKeys.length
    let keysArrayCopy = [...keysArray]
    dataKeys.forEach((item) => {
        if (keysArrayCopy.includes(item)) {
            keysArrayCopy.splice(keysArrayCopy.indexOf(item), 1)
        } else {
            doKeysMatch = false
        }
    })

    if (!doKeysMatch) {
        return false
    }

    let dataValues = []
    dataKeys.forEach((item) => {
        dataValues.push(data[item])
    })

    let areValuesStrings = dataValues.length == keysArray.length
    dataValues.forEach((item) => {
        if (typeof item != 'string') {
            areValuesStrings = false
        }
    })

    if (!areValuesStrings) {
        return false
    }

    return true
}

function validatePut(keysArray, data) {
    if (typeof data != 'object') {
        return false
    }
    
    let dataKeys = []
    for (i in data) {
        dataKeys.push(i)
    }

    let doKeysMatch = dataKeys.length >= 1
    let keysArrayCopy = [...keysArray]
    dataKeys.forEach((item) => {
        if (keysArrayCopy.includes(item)) {
            keysArrayCopy.splice(keysArrayCopy.indexOf(item), 1)
        } else {
            doKeysMatch = false
        }
    })

    if (!doKeysMatch) {
        return false
    }

    let dataValues = []
    dataKeys.forEach((item) => {
        dataValues.push(data[item])
    })

    let areValuesStrings = dataValues.length == dataKeys.length
    dataValues.forEach((item) => {
        if (typeof item != 'string') {
            areValuesStrings = false
        }
    })

    if (!areValuesStrings) {
        return false
    }

    return true
}
    
const getAllRoute = async (req, res) => {
    const client = await getClient()

    const cParks = client.db("rexburg").collection("parks").find({})
    const cRestaurants = client.db("rexburg").collection("restaurants").find({})

    const dataParks = await cParks.toArray()
    const dataRestaurants = await cRestaurants.toArray()

    const dataAll = dataParks.concat(dataRestaurants)

    if (dataAll.length >= 1) {
        res.status(200).send(dataAll)
    } else {
        res.status(500).send("Nothing was found.")
    }

    await client.close()
}

const getAllParksRoute = async (req, res) => {
    const client = await getClient()
    const c = client.db("rexburg").collection("parks").find({})
    const data = await c.toArray()

    if (data.length >= 1) {
        res.status(200).send(data)
    } else {   
        res.status(500).send("Nothing was found.")
    }

    await client.close()
}

const getAllRestaurantsRoute = async (req, res) => {
    const client = await getClient()
    const c = client.db("rexburg").collection("restaurants").find({})    
    
    const data = await c.toArray()

    if (data.length >= 1) {
        res.status(200).send(data)
    } else {   
        res.status(500).send("Nothing was found.")
    }

    await client.close()
}

const getParkRoute = async (req, res) => {
    if (!m.ObjectId.isValid(req.params.id)) {
        res.status(400).send("The given id cannot be used.")
        return
    }

    const client = await getClient()
    
    const data = await client.db("rexburg").collection("parks").findOne({_id: new m.ObjectId(req.params.id)})
    
    if (data) {
        res.status(200).send(data)
    } else (
        res.status(400).send("Park Not Found")
    )

    await client.close()

}

const getRestaurantRoute = async (req, res) => {
    if (!m.ObjectId.isValid(req.params.id)) {
        res.status(400).send("The given id cannot be used.")
        return
    }

    const client = await getClient()
    const data = await client.db("rexburg").collection("restaurants").findOne({_id: new m.ObjectId(req.params.id)})
    
    if (data) {
        res.status(200).send(data)
    } else (
        res.status(400).send("Restaurant Not Found")
    )

    await client.close()

}

const postParkRoute = async (req, res) => {
    if (!validatePost(["name", "where"], req.body)) {
        res.status(400).send("The input is invalid.")
        return
    }

    const client = await getClient()
    data = await client.db("rexburg").collection("parks").insertOne(req.body)
    
    if (data.acknowledged) {
        res.status(201).send(data.insertedId)
    } else {
        res.status(500).send("There was an error in performing this post function.")
    }
    
    await client.close()
}

const postResaurantRoute = async (req, res) => {
    if (!validatePost(["name", "where", "site", "rating", "type", "phone", "orderLink"], req.body)) {
        res.status(400).send("The input is invalid.")
        return
    }

    const client = await getClient()
    data = await client.db("rexburg").collection("restaurants").insertOne(req.body)
    
    if (data.acknowledged) {
        res.status(201).send(data.insertedId)
    } else {
        res.status(500).send("There was an error in performing this post function.")
    }
    
    await client.close()
}

const putParkRoute = async (req, res) => {
    if (!validatePut(["name", "where"], req.body)) {
        res.status(400).send("The body is invalid.")
        return
    }

    if (!m.ObjectId.isValid(req.params.id)) {
        res.status(400).send("The given id cannot be used.")
        return
    }

    const client = await getClient()
    put = await client.db("rexburg").collection("parks").updateOne({_id: new m.ObjectId(req.params.id)}, {$set: req.body})

    if (put.modifiedCount >= 1) {
        res.status(204).send(`modifiedCount: ${put.modifiedCount}`)
    } else {
        res.status(500).send(`There was an error in performing this put function (as modifiedCount is ${put.modifiedCount}).`)
    }

    await client.close()
}

const putRestaurantRoute = async (req, res) => {
    if (!validatePut(["name", "where", "site", "rating", "type", "phone", "orderLink"], req.body)) {
        res.status(400).send("The body is invalid.")
        return
    }

    if (!m.ObjectId.isValid(req.params.id)) {
        res.status(400).send("The given id cannot be used.")
        return
    }

    const client = await getClient()
    put = await client.db("rexburg").collection("restaurants").updateOne({_id: new m.ObjectId(req.params.id)}, {$set: req.body})

    if (put.modifiedCount >= 1) {
        res.status(204).send(`modifiedCount: ${put.modifiedCount}`)
    } else {
        res.status(500).send(`There was an error in performing this put function (as modifiedCount is ${put.modifiedCount}).`)
    }

    await client.close()
}

const deleteParkRoute = async (req, res) => {
    if (!m.ObjectId.isValid(req.params.id)) {
        res.status(400).send("The given id cannot be used.")
        return
    }

    const client = await getClient()
    del = await client.db("rexburg").collection("parks").deleteOne({_id: new m.ObjectId(req.params.id)})

    if (del.deletedCount >= 1) {
        res.status(200).send(`deletedCount: ${del.deletedCount}`)
    } else {
        res.status(500).send(`There was an error in performing this delete function (as deletedCount is ${del.deletedCount}).`)
    }

    await client.close()
}

const deleteRestaurantRoute = async (req, res) => {
    if (!m.ObjectId.isValid(req.params.id)) {
        res.status(400).send("The given id cannot be used.")
        return
    }

    const client = await getClient()
    del = await client.db("rexburg").collection("restaurants").deleteOne({_id: new m.ObjectId(req.params.id)})

    if (del.deletedCount >= 1) {
        res.status(200).send(`deletedCount: ${del.deletedCount}`)
    } else {
        res.status(500).send(`There was an error in performing this delete function (as deletedCount is ${del.deletedCount}).`)
    }

    await client.close()
}

const authenticatedWelcomeRoute = (req, res) => {
    res.send(`Authenticated, Welcome! Please visit <a href="./api-docs">/api-docs</a> to make various requests`)
}

const welcomeUnauthRoute = (req, res) => {
    res.send('Welcome to rexburg api. You are <strong>not</strong> logged in! Please visit: <a href="/auth/google">/auth/google</a>')
}

// used code from comment by on @abdulsamadgomda4387 on youtube video https://www.youtube.com/watch?v=SBvmnHTQIPY (as well as code from the video...)
const logoutRoute = (req, res) => {
    req.logout((err)=>{
        if (err) {
            console.log(err)
            res.status(500).send('There was an error with /auth/logout')
        }
        res.redirect('/')
    })
}

module.exports = {
    getAllRoute,
    getAllParksRoute,
    getAllRestaurantsRoute,
    getParkRoute,
    getRestaurantRoute,
    postParkRoute,
    postResaurantRoute,
    putParkRoute,
    putRestaurantRoute,
    deleteParkRoute,
    deleteRestaurantRoute,
    authenticatedWelcomeRoute,
    welcomeUnauthRoute,
    logoutRoute
}