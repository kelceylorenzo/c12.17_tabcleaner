const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const mysql = require('mysql');
const mysqlCredentials = require('../mysqlCredentials.js');
const db = mysql.createConnection(mysqlCredentials);

function checkIfTableExists(req, res, next) {
    
};

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {

        const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
        const newUser = {
            googleID: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            image: image
        }

        const findUserSQL = "SELECT * FROM users WHERE googleID=? LIMIT 1"
        const findUserInsert = newUser.googleID;
        const findUser = mysql.format(findUserSQL, findUserInsert);

        db.query(findUser, (err, results, fields) => {

            if (err) throw err;

            if (results.length > 0) {
                console.log('user was in db.....');
                return done(null, newUser);
            } else {
                console.log('Inserting User.......');

                const { googleID, firstName, lastName, email, image } = newUser;

                let insertUserSQL = 'INSERT INTO ?? (??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?)';
                let insertUserInsert = ['users', 'googleID', 'firstName', 'lastName', 'email', 'image', googleID, firstName, lastName, email, image];
                let insertUser = mysql.format(query, inserts);

                db.query("CREATE TABLE IF NOT EXISTS users (" +
                        "googleID double NOT NULL PRIMARY KEY," +
                        "firstName VARCHAR(30) NULL," +
                        "lastName VARCHAR(30) NULL," +
                        "email VARCHAR(50) NULL," +
                        "image VARCHAR(200) NULL);",
                        (err, results, fields) => {
                            if (err) throw err;
                            db.query(insertUser, (err, results, fields) => {
                                if (err) throw err;
                                console.log('user was not in db, but is now');
                                return done(null, newUser);
                            });
                        });
            };
        });
    }));


    passport.serializeUser((user, done) => {

        done(null, user.googleID);

    })

    passport.deserializeUser((id, done) => {

        const findUserSQL = "SELECT * FROM users WHERE googleID = ?"
        const findUserInsert = id;
        const findUser = mysql.format(query, insert);

        db.query(findUser, (err, results, fields) => {
            if (err) throw err;
            done(null, id);
        })
    })
};

