const express = require('express');
const router = express.Router();
const path = require('path');
const { mysqlCredentials } = require('../config/keys');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);
const { ensureAuthenticated,
    checkIfTableExists,
    updateUrlTable,
    produceOutput } = require('../helper/helpers');

db.connect((err) => {
    if (err) throw err;
    else console.log("Connected to remote DB");
});

router.get('/', ensureAuthenticated, (req, res) => {

    const query = 'SELECT *, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) AS currentTime FROM tabs WHERE googleID = ?';
    const sql = mysql.format(query, req.user.googleID);

    db.query(sql, (err, results) => {
        const output = produceOutput(err, results, 'GET');
        res.send(output);
    });

});

router.post('/', ensureAuthenticated, checkIfTableExists, (req, res) => {

    const googleID = req.user.googleID;

    const { windowID, tabTitle, browserTabIndex, url, favicon, screenshot } = req.body;

    const query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000), ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000), ?, ?, ?, ?, ?)';
    const insert = ['tabs', 'windowID', 'tabTitle', 'activatedTime', 'deactivatedTime', 'browserTabIndex', 'googleID', 'url', 'favicon', 'screenshot',
        windowID, tabTitle, browserTabIndex, googleID, url, favicon, screenshot];
    const sql = mysql.format(query, insert);
   
    db.query(sql, (err, results) => {
        const output = produceOutput(err, results, 'POST');
        res.send(output);
    });

});

router.delete('/:deleteSource', ensureAuthenticated, (req, res) => {

    let sql;

    const { databaseTabID } = req.body;

    if (req.params.deleteSource === 'google') {
        const query = 'DELETE FROM tabs WHERE googleID = ?';
        sql = mysql.format(query, req.user.googleID);
    }

    if (req.params.deleteSource === 'database') {
        const query = 'DELETE FROM tabs WHERE databaseTabID = ? AND googleID = ?';
        sql = mysql.format(query, [databaseTabID, req.user.googleID])
        updateUrlTable(req);
    }

    db.query(sql, (err, results) => {
        const output = produceOutput(err, results, 'DELETE');
        res.send(output);
    });

});

router.put('/', ensureAuthenticated, checkIfTableExists, (req, res) => {

    const { databaseTabID, tabTitle, browserTabIndex, url, favicon } = req.body;

    const query = 'UPDATE tabs SET tabTitle=?, browserTabIndex=?, url=?, favicon=? WHERE databaseTabID = ? AND googleID = ?';
    const insert = [tabTitle, browserTabIndex, url, favicon, databaseTabID, req.user.googleID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results) => {
        const output = produceOutput(err, results, 'UPDATE');
        res.send(output);
    });

});

router.put('/move', ensureAuthenticated, (req, res) => {

    const { databaseTabID, browserTabIndex } = req.body;

    const query = 'UPDATE tabs SET browserTabIndex=? WHERE databaseTabID = ? AND googleID = ?';
    const insert = [browserTabIndex, databaseTabID, req.user.googleID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        const output = produceOutput(err, results, 'MOVE');
        res.send(output);
    });

});

router.put('/:time', ensureAuthenticated, checkIfTableExists, (req, res) => {

    const { databaseTabID} = req.body;

    if (req.params.time === 'deactivatedTime') {
        updateUrlTable(req);
    };

    const query = 'Update tabs SET ?? = ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE databaseTabID = ?';
    const insert = [req.params.time, databaseTabID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results) => {
        output = produceOutput(err, results, req.params.time);
        res.send(output);
    });

});

module.exports = router;
