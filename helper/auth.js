module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            console.log('GET OUTTA HERE');
            res.redirect('/auth/google');
        }
    }
};