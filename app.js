const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

// Load User Model
require('./models/GoogleUser');

// Google Passport Config
require('./config/googlePassport')(passport);

// Load Routes
const auth = require('./routes/auth');

// Load Keys
const keys = require('./config/keys');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

app.use(express.static(path.resolve(__dirname, 'client', 'dist')));

// app.get('/', (req, res) => {
//   res.send('It Works!');
// });

// Authentication Middleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Vars
app.use((req, res, next)=>{
  res.locals.user = req.user || null;
  next();
});

// Use Routes
app.use('/auth', auth);

app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
