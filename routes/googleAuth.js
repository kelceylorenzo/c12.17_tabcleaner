const express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();
const { mysqlCredentials } = require('../config/keys');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);

/** Sets static file path */
router.use(express.static(path.join(__dirname, 'client', 'dist')));

/** Google Login Route */
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {});

/** Callback for Google login that redirects to the dashboard */
router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
});

/** Allows the front end to query if a user is logged in */
router.get('/verify', (req, res) => {
    if (req.user) {
        res.send({
            success: true,
            user: req.user});
    } else {
        console.log('Not Auth');
        res.send({
            success: false
        });
    }
});

/** Logs out the user and redirects to home page */
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('www.closeyourtabs.com/');
});

module.exports = router;
