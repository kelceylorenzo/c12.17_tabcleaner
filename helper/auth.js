module.exports = {
    ensureAuthenticated: function (req, res, next) {
        console.log('req.user: ', req.user);
        if (req.user) {
            return next();
        } else {
            console.log('This is the ensureAuthentication saying that the user is not autheticated.');
            res.redirect('auth/google');
        }
    }
};