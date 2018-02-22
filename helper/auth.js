module.exports = {
    ensureAuthenticated: function (req, res, next) {
        console.log('SessionID ', req.sessionID);
        console.log('req.query ', req.query);
        console.log('Access Token? : ', req.query.access_token);
        if (req.isAuthenticated()) {
            return next();
        } else {
            console.log('GET OUTTA HERE');
            res.redirect('/auth/google');
        }
    }
};