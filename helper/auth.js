module.exports = {
    ensureAuthenticated: function(req, res, next){
      if(req.isAuthenticated()){
        return next();
      } else {
        req.flash('error_msg', 'Not authorized');
        res.redirect('/users/login');
      };
    }
  };