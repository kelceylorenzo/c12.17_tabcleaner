const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

// Google Passport Config
require('./config/googlePassport')(passport);

// Load Routes
const googleAuth = require('./routes/googleAuth');
const tabs = require('./routes/tabs');
const urls = require('./routes/urls');

// Load Keys
const keys = require('./config/keys');

const app = express();

app.use(express.static(path.join(__dirname, 'client', 'dist')));

// ALLOWS THE EXTENSION TO INTERACT WITH DB, REQUIRES ATTENTION FOR DEPLOYMENT
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}))

// Authentication Middleware
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Use Routes
app.use('/auth/google', googleAuth);
app.use('/tabs', tabs);
app.use('/urls', urls);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
