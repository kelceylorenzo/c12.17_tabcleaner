const express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();

router.use(express.static(path.join(__dirname, 'client', 'dist')));

router.get('/', passport.authenticate('google', {scope: ['profile', 'email']}), (req, res)=>{
  console.log('Made it');
});

router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }) ,(req, res) => {
    res.redirect('/dashboard');
});

router.get('/verify', (req, res)=>{
  if(req.user){
    res.send(true);
    console.log(req.user);
  } else {
    console.log('Not Auth');
    res.send(false);
  }
});

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});

module.exports = router;
