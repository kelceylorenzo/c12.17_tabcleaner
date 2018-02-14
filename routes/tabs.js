const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

// User Login Route
router.get('/tabs', (req, res) => {
    res.render('users/login');
});

router.post('/tabs', (req, res)=>{
    
});