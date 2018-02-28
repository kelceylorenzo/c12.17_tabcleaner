const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('mysql');
const { mysqlCredentials, googleCredentials } = require('./keys');
const db = mysql.createConnection(mysqlCredentials);

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: googleCredentials.googleClientID,
        clientSecret: googleCredentials.googleClientSecret,
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
        };

        const findUserSQL = "SELECT * FROM users WHERE googleID=? LIMIT 1"
        const findUserInsert = newUser.googleID;
        const findUser = mysql.format(findUserSQL, findUserInsert);

        db.query(findUser, (err, results) => {
            if (err) console.log(err);
            if (results.length > 0) {
                console.log('User was in db.....');
                return done(null, newUser);
            } else {
                console.log('Inserting User.......');

                const { googleID, firstName, lastName, email, image } = newUser;

                const insertUserSQL = 'INSERT INTO ?? (??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?)';
                const insertUserInsert = ['users', 'googleID', 'firstName', 'lastName', 'email', 'image', googleID, firstName, lastName, email, image];
                const insertUser = mysql.format(insertUserSQL, insertUserInsert);

                db.query("CREATE TABLE IF NOT EXISTS users (" +
                    "googleID double NOT NULL PRIMARY KEY," +
                    "firstName VARCHAR(30) NULL," +
                    "lastName VARCHAR(30) NULL," +
                    "email VARCHAR(50) NULL," +
                    "image VARCHAR(200) NULL);",
                    (err) => {
                        if (err) console.log(err);
                        db.query(insertUser, (err) => {
                            if (err) console.log(err);
                            console.log('User was not in db, but is now');
                            return done(null, newUser);
                        });
                    }
                );
            }
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    })

    passport.deserializeUser((user, done) => {

        const findUserSQL = "SELECT * FROM users WHERE googleID = ?"
        const findUserInsert = user.googleID;
        const findUser = mysql.format(findUserSQL, findUserInsert);

        db.query(findUser, (err, results, fields) => {
            if (err){
                console.log(err);
            } else {
            done(null, user);
            }
        });
    });
};

