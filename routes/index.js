// used code from https://www.youtube.com/watch?v=K00J87SofEc
// used code from https://stackoverflow.com/questions/34095126/express-router-id
// used code from https://nordicapis.com/building-a-restful-api-using-node-js-and-mongodb/
// used code from https://www.youtube.com/watch?v=SBvmnHTQIPY

const {ensureAuth, ensureGuest} = require('../middleware/auth.js')
const routes = require("express").Router()
const c = require("../controllers/index.js")

routes.get('/', ensureGuest, c.welcomeUnauthRoute)

routes.get('/all', ensureAuth, c.getAllRoute)

// get all of collection
routes.get('/parks', ensureAuth, c.getAllParksRoute)
routes.get('/restaurants', ensureAuth, c.getAllRestaurantsRoute)

// get single from collection
routes.get('/parks/:id', ensureAuth, c.getParkRoute)
routes.get('/restaurants/:id', ensureAuth, c.getRestaurantRoute)

// post
routes.post('/post-park', ensureAuth, c.postParkRoute)
routes.post('/post-restaurant', ensureAuth, c.postResaurantRoute)

// put
routes.put('/put-park/:id', ensureAuth, c.putParkRoute)
routes.put('/put-restaurant/:id', ensureAuth, c.putRestaurantRoute)

// delete
routes.delete('/delete-park/:id', ensureAuth, c.deleteParkRoute)
routes.delete('/delete-restaurant/:id', ensureAuth, c.deleteRestaurantRoute)

// documentation
// used code from https://www.npmjs.com/package/swagger-ui-express
const su = require("swagger-ui-express")
const swag = require("../swagger.json")
routes.use('/api-docs', ensureAuth, su.serve)
routes.get('/api-docs', ensureAuth, su.setup(swag))

// used code from https://www.youtube.com/watch?v=SBvmnHTQIPY
// auth
passport = require('passport')
routes.get('/authenticated', ensureAuth, c.authenticatedWelcomeRoute)
routes.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))
routes.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {res.redirect('/authenticated')})
// used code from comment by on @abdulsamadgomda4387 on youtube video https://www.youtube.com/watch?v=SBvmnHTQIPY
routes.get('/auth/logout', ensureAuth, (req, res) => {
    req.logout((err)=>{
        if (err) {
            console.log(err)
        }
        res.redirect('/')
    })
})

module.exports = routes