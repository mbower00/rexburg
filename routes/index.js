// used code from https://www.youtube.com/watch?v=K00J87SofEc
// used code from https://stackoverflow.com/questions/34095126/express-router-id
// used code from https://nordicapis.com/building-a-restful-api-using-node-js-and-mongodb/

const routes = require("express").Router()
const c = require("../controllers/index.js")

routes.get('/', c.getAllRoute)

// get all of collection
routes.get('/parks', c.getAllParksRoute)
routes.get('/restaurants', c.getAllRestaurantsRoute)

// get single from collection
routes.get('/parks/:id', c.getParkRoute)
routes.get('/restaurants/:id', c.getRestaurantRoute)

// post
routes.post('/post-park', c.postParkRoute)
routes.post('/post-restaurant', c.postResaurantRoute)

// put
routes.put('/put-park/:id', c.putParkRoute)
routes.put('/put-restaurant/:id', c.putRestaurantRoute)

// delete
routes.delete('/delete-park/:id', c.deleteParkRoute)
routes.delete('/delete-restaurant/:id', c.deleteRestaurantRoute)

// documentation
// used code from https://www.npmjs.com/package/swagger-ui-express
const su = require("swagger-ui-express")
const swag = require("../swagger.json")
routes.use('/api-docs', su.serve)
routes.get('/api-docs', su.setup(swag))

// used code from https://www.youtube.com/watch?v=SBvmnHTQIPY
routes.get('/google', c.authentication)

module.exports = routes