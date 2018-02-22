module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            console.log('This is the ensureAuthentication saying that the user is not autheticated.');
            res.redirect('auth/google');
        }
    }
};