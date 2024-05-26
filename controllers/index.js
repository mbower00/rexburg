// used code from https://www.coderrocketfuel.com/article/store-mongodb-credentials-as-environment-variables-in-nodejs
// used code from https://www.youtube.com/watch?v=K00J87SofEc
// used code from https://www.mongodb.com/developer/languages/javascript/node-crud-tutorial/
// used code from https://stackoverflow.com/questions/34095126/express-router-id
// used code from https://www.mongodb.com/docs/manual/reference/method/db.collection.find/

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
    
const getAllRoute = async (req, res) => {
    const client = await getClient()

    const cParks = client.db("rexburg").collection("parks").find({})
    const cRestaurants = client.db("rexburg").collection("restaurants").find({})

    const dataParks = await cParks.toArray()
    const dataRestaurants = await cRestaurants.toArray()

    const dataAll = dataParks.concat(dataRestaurants)

    res.send(dataAll)
    await client.close()
}

const getAllParksRoute = async (req, res) => {
    const client = await getClient()
    const c = client.db("rexburg").collection("parks").find({})
    const data = await c.toArray()
    
    res.send(data)
    await client.close()
}

const getAllRestaurantsRoute = async (req, res) => {
    const client = await getClient()
    const c = client.db("rexburg").collection("restaurants").find({})
    const data = await c.toArray()
    
    res.send(data)
    await client.close()
}

const getParkRoute = async (req, res) => {
    const client = await getClient()
    const data = await client.db("rexburg").collection("parks").findOne({_id: new m.ObjectId(req.params.id)})
    
    if (data) {
        res.send(data)
    } else (
        res.send("Park Not Found")
    )

    await client.close()

}

const getRestaurantRoute = async (req, res) => {
    const client = await getClient()
    const data = await client.db("rexburg").collection("restaurants").findOne({_id: new m.ObjectId(req.params.id)})
    
    if (data) {
        res.send(data)
    } else (
        res.send("Restaurant Not Found")
    )

    await client.close()

}

const postParkRoute = async (req, res) => {
    const client = await getClient()
    data = await client.db("rexburg").collection("parks").insertOne(req.body)
    
    res.send(data.insertedId)
    await client.close()

}

const postResaurantRoute = async (req, res) => {
    const client = await getClient()
    data = await client.db("rexburg").collection("restaurants").insertOne(req.body)
    
    res.send(data.insertedId)
    await client.close()

}

module.exports = {
    getAllRoute,
    getAllParksRoute,
    getAllRestaurantsRoute,
    getParkRoute,
    getRestaurantRoute,
    postParkRoute,
    postResaurantRoute
}