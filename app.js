const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");

/** Google Passport Config */
require("./config/googlePassport")(passport);

/** Load Routes */
const googleAuth = require('./routes/googleAuth');
const tabs = require('./routes/tabs');
const urls = require('./routes/urls');

/** Load Keys */
const keys = require("./config/keys");

//* Established Server */
const app = express();

/** Establishes a static file */
app.use(express.static(path.join(__dirname, "client", "dist")));

/** Allows the extension to communicate with the server */
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/** Authentication Middleware */
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000}
}));

/** Body Parser Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Passport middleware */
app.use(passport.initialize());
app.use(passport.session());

/** Set Global Vars */
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

/** Routers */
app.use('/auth/google', googleAuth);
app.use('/tabs', tabs);
app.use('/urls', urls);

/** Route that catches erronious route calls */
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

/** Sets PORT */
const PORT = process.env.PORT || 5000;

/** Allows node to listen on PORT */
app.listen(PORT, err => {
	if (err) console.log("Error:", err.message);
	console.log(`Server started on port ${PORT}`);
});
