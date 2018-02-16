const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const mysql = require('mysql');
const mysqlCredentials = require('../mysqlCredentials.js');
const db = mysql.createConnection(mysqlCredentials);

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

        let query = "SELECT * FROM users WHERE googleID=? LIMIT 1"
        let insert = newUser.googleID;

        let sql = mysql.format(query, insert);

        db.query(sql, (err, results, fields) => {
            console.log('err: ', err);
            if (err) throw err;
            const output = {
                success: true,
                data: results,
                fields: fields
            }
            if (results[0].googleID) {
                console.log('user was in db: ', results[0]);
                return done(null, results[0]);
            } else {
                let query = 'INSERT INTO ?? (??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?)';
                let inserts = ['googleID', 'firstName', 'lastName', 'email', 'image', googleID, firstName, lastName, email, image];
                let sql = mysql.format(query, inserts);
                db.query(sql, (err, results, fields) => {
                    console.log('err: ', err);
                    if (err) throw err;
                    const output = {
                        success: true,
                        data: results,
                        fields: fields
                    }
                    console.log('user was not in db, but is now: ', results[0]);
                })
            }
        });
    }));


    passport.serializeUser((user, done) => {
        done(null, user.googleID);
    })
    passport.deserializeUser((id, done) => {
        let query = "SELECT * FROM users WHERE googleID = ?"
        let insert = id;
        let sql = mysql.format(query, insert);

        db.query(sql, (err, results, fields) => {
            console.log('err: ', err);
            if (err) throw err;
            done(null, id);
        })
    })
};

