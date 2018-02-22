module.exports = {
    ensureAuthenticated: function (req, res, next) {
        console.log(req.sessionID);

        if (req.isAuthenticated()) {
            return next();
        } else {
            console.log('GET OUTTA HERE');
            res.redirect('/auth/google');
        }
    }
};