const express = require('express');
const router = express.Router();
const path = require('path');
const { mysqlCredentials } = require('../config/keys');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);
const { ensureAuthenticated, 
        checkIfTableExists, 
        updateUrlTable, 
        produceOutput, 
        getDatabaseTime } = require('../helper/helpers');



        
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to remote DB");
});

router.get('/', ensureAuthenticated, (req, res) => {

        const query = 'SELECT *, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) AS currentTime FROM tabs WHERE googleID = ?';
        const insert = req.user.googleID;
        const sql = mysql.format(query, insert);

        db.query(sql, function (err, result) {
            const output = produceOutput(err, result, req.user, 'GET');
            const json_output = JSON.stringify(output);
            res.send(json_output);
        });
});

router.post('/', ensureAuthenticated, checkIfTableExists, (req, res) => {
    const googleID = req.user.googleID;
    const { windowID, tabTitle, browserTabIndex, url, favicon, screenshot } = req.body;

    const query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000), ?, ?, ?, ?, ?)';
    const insert = ['tabs', 'windowID', 'tabTitle', 'deactivatedTime', 'browserTabIndex', 'googleID', 'url', 'favicon', 'screenshot',
        windowID, tabTitle, browserTabIndex, googleID, url, favicon, screenshot];
    const sql = mysql.format(query, insert);
    db.query(sql, (err, results) => {
        console.log(err);
        const output = produceOutput(err, results, req.user, 'POST');
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.delete('/:deleteSource', ensureAuthenticated, (req, res) => {

    let sql;

    if (req.params.deleteSource === 'google') {
        const query = 'DELETE FROM tabs WHERE googleID = ?';
        sql = mysql.format(query, req.user.googleID);
    }
    if (req.params.deleteSource === 'database') {
        const query = 'DELETE FROM tabs WHERE databaseTabID = ? AND googleID = ?';
        sql = mysql.format(query, [req.body.databaseTabID, req.user.googleID])
        updateUrlTable(req.body.databaseTabID);
    }

    db.query(sql, (err, results) => {
        const output = produceOutput(err, results, req.user, 'DELETE');
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.put('/', ensureAuthenticated, checkIfTableExists, (req, res) => {

    const { databaseTabID, tabTitle, browserTabIndex, url, favicon } = req.body;

    const query = 'UPDATE tabs SET tabTitle=?, browserTabIndex=?, url=?, favicon=? WHERE databaseTabID = ? AND googleID = ?';
    const insert = [tabTitle, browserTabIndex, url, favicon, databaseTabID, req.user.googleID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results) => {
        const output = produceOutput(err, results, req.user, 'UPDATE');
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });

});

router.put('/move', ensureAuthenticated, (req, res) => {

    const { databaseTabID, browserTabIndex } = req.body;

    const query = 'UPDATE tabs SET browserTabIndex=? WHERE databaseTabID = ? AND googleID = ?';
    const insert = [browserTabIndex, databaseTabID, req.user.googleID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        const output = produceOutput(err, results, req.user, 'MOVE');
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });

});

router.put('/:time', ensureAuthenticated, checkIfTableExists, (req, res) => {

    const { databaseTabID, url } = req.body;

    if (req.params.time === 'deactivatedTime' && url) {
        updateUrlTable(databaseTabID, req.user);
    };

    const query = 'Update tabs SET ?? = ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE databaseTabID = ?';
    const insert = [req.params.time, databaseTabID];
    const sql = mysql.format(query, insert);    

    db.query(sql, (err, result) => {
        output = produceOutput(err, results, user, timeType);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
      
});

module.exports = router;
