// used code from: https://www.youtube.com/watch?v=SBvmnHTQIPY

module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/authenticated')
        } else {
            return next()
        }
    }
}