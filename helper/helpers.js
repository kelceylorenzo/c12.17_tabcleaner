const { mysqlCredentials } = require('../config/keys');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.user) {
            console.log('req.user: ', req.user.firstName);
            return next();
        } else {
            console.log('This is the ensureAuthentication saying that the user is not autheticated.');
            res.send({
                success: false,
                message: 'Authentication failed, no user present.'
            })
        }
    },
    checkIfTableExists: function (req, res, next) {
        let sql = "CREATE TABLE IF NOT EXISTS tabs (" +
            "databaseTabID MEDIUMINT(8) NOT NULL PRIMARY KEY AUTO_INCREMENT," +
            "windowID MEDIUMINT(8) NULL ," +
            "tabTitle VARCHAR(200) NULL," +
            "activatedTime double NULL," +
            "deactivatedTime double NULL," +
            "browserTabIndex int(10) NULL," +
            "googleID double NULL," +
            "url VARCHAR(2084) NULL," +
            "favicon VARCHAR(2084) NULL," +
            "screenshot VARCHAR(50000) NULL);";
        db.query(sql, (err, results) => {
            if (err) {
                throw err;
            } else {
                next();
            }
        });
    },
    updateUrlTable: function (req) {

        const { databaseTabID } = req.body;
        const { user } = req;

        const getActiveTimeQuery = 'SELECT url, activatedTime, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) AS currentTime FROM tabs WHERE databaseTabID = ?';
        const getActiveTimeInsert = databaseTabID;
        const getActiveTimeSQL = mysql.format(getActiveTimeQuery, getActiveTimeInsert);

        db.query(getActiveTimeSQL, (err, results) => {

            if (err) console.log(err);
            else {
                if (typeof (url) != 'undefined' && typeof (activatedTime) != 'undefined' && typeof (currentTime) != 'undefined') {

                    const { url, activatedTime, currentTime } = results[0];

                    let domain = (url).match(/([a-z0-9|-]+\.)*[a-z0-9|-]+\.[a-z]+/g)
                        || (url).match(/^(chrome:)[//]{2}[a-zA-Z0-0]*/)
                        || (url).match(/^(localhost)/);

                    if (domain != null) {
                        domain = domain[0];

                        let newActiveTime = currentTime - activatedTime;

                        const createUrlTableSQL = "CREATE TABLE IF NOT EXISTS urls (" +
                            "databaseUrlID MEDIUMINT(8) NOT NULL PRIMARY KEY AUTO_INCREMENT," +
                            "googleID DOUBLE NULL," +
                            "url VARCHAR(200) NULL," +
                            "totalActiveTime INT(20) NULL);";

                        db.query(createUrlTableSQL, (err) => {
                            if (err) console.log(err);

                            const activeTimeQuery = 'SELECT * FROM urls WHERE googleID=? AND url=?';
                            const activeTimeInsert = [user.googleID, domain];
                            const activeTimeSQL = mysql.format(activeTimeQuery, activeTimeInsert);

                            db.query(activeTimeSQL, (err, results) => {

                                if (results.length > 0) {
                                    newActiveTime = results[0].totalActiveTime + newActiveTime;
                                    const updateActiveTimeQuery = 'UPDATE urls SET totalActiveTime = ? WHERE databaseUrlID= ?';
                                    const updateActiveTimeInsert = [newActiveTime, results.databaseUrlID];
                                    const updateActiveTimeSQL = mysql.format(updateActiveTimeQuery, updateActiveTimeInsert);
                                    db.query(updateActiveTimeSQL, (err) => {
                                        if (err) console.log(err);
                                        else console.log('UPDATED URL in table: domain: ', domain, ', time: ', newActiveTime);
                                    });

                                } else {
                                    const insertUrlQuery = 'INSERT INTO urls (googleID, url, totalActiveTime) VALUES (?, ?, ?)'
                                    const insertUrlInsert = [user.googleID, domain, newActiveTime];
                                    const insertUrlSQL = mysql.format(insertUrlQuery, insertUrlInsert);
                                    db.query(insertUrlSQL, (err, results) => {
                                        if (err) console.log(err);
                                        else console.log('CREATED URL in table, domain: ', domain, ', time: ', newActiveTime);
                                    });
                                }
                            })
                        })
                    }
                } 
            }
        })
    },
    produceOutput: function (err, result, location) {
        const output = {
            type: location,
            success: false,
            data: result,
            code: '503'
        };
        if (err) {
            output.message = "It's dead Jim.";
        } else {
            if (result.affectedRows > 0 || result.length > 0) {
                output.code = '200';
                output.success = true;
                output.message = 'Everything went great.';
            } else {
                output.code = '404';
                output.success = false;
                output.message = 'No data for user';
            }
        }
        console.log(output);
        const json_output = JSON.stringify(output);
        return json_output;
    },
};