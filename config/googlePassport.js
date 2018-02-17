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

        const query = "SELECT * FROM users WHERE googleID=? LIMIT 1"
        const insert = newUser.googleID;

        let sql = mysql.format(query, insert);

        const createUserTblSQL = 
            "CREATE TABLE users ("
            "googleID double NOT NULL PRIMARY KEY,"
            "firstName VARCHAR(30) NULL,"
            "lastName VARCHAR(30) NULL,"
            "email VARCHAR(50) NULL,"
            "image VARCHAR(200) NULL"
            ");";

        const tblChkSql = "SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'closeyourtabs') AND (TABLE_NAME = 'tabs');";

        function insertUser(){
            db.query(sql, (err, results, fields) => {
                console.log('err: ', err);
                if (err) throw err;
                const output = {
                    success: true,
                    data: results,
                    fields: fields
                };
                console.log(output);
                if (results.length > 0) {
                    console.log('user was in db: ', results[0]);
                    return done(null, results[0]);
                } else {
                    console.log('Inserting User.......', newUser)
                    const {googleID, firstName, lastName, email, image} = newUser;
     
                    let query = 'INSERT INTO ?? (??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?)';
                    let inserts = ['users', 'googleID', 'firstName', 'lastName', 'email', 'image', googleID, firstName, lastName, email, image];
                    let sql = mysql.format(query, inserts);
                    db.query(sql, (err, results, fields) => {
                        console.log('err: ', err);
                        if (err) throw err;
                        const output = {
                            success: true,
                            data: results,
                            fields: fields
                        };
                        console.log('user was not in db, but is now: ', newUser);
                    });
                };
            });
        };

        db.query(tblChkSql, (err, results, fields)=>{
            if(results.count == 0){
                db.query(createUserTblSQL, (err, results, fields)=>{
                    insertUser();
                });
            } else {
                insertUser();
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

