const express = require('express');
const router = express.Router();
const path = require('path');
const { mysqlCredentials } = require('../config/keys');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);
const { ensureAuthenticated, checkIfTableExists, updateUrlTable } = require('../helper/helpers');

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to remote DB");
});

router.get('/', ensureAuthenticated, (req, res) => {

    const query = 'SELECT * FROM tabs WHERE googleID=?';
    const insert = req.user.googleID;
    const sql = mysql.format(query, insert);

    db.query(sql, function (err, results) {
        if (err) console.log('Error, GET: ', err);
        const output = {
            type: 'GET',
            success: true,
            data: results
        };
        const json_output = JSON.stringify(output);
        res.send(json_output);
        console.log('GET from: ', req.user.googleID);
    });

});

router.post('/', ensureAuthenticated, checkIfTableExists, (req, res) => {
    const googleID = req.user.googleID;
    const { windowID, tabTitle, activatedTime, deactivatedTime, browserTabIndex, url, favicon, screenshot } = req.body;

    const query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const insert = ['tabs', 'windowID', 'tabTitle', 'activatedTime', 'deactivatedTime', 'browserTabIndex', 'googleID', 'url', 'favicon', 'screenshot',
        windowID, tabTitle, activatedTime, deactivatedTime, browserTabIndex, googleID, url, favicon, screenshot];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if (err) console.log('Error, POST: ', err);
        const output = {
            type: 'POST',
            success: true,
            affectedRows: results.affectedRows,
            insertId: results.insertId,
            fields: fields
        };
        console.log('POST from ', googleID, 'Data: ', output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.delete('/:deleteID', ensureAuthenticated, (req, res) => {

    let searchType;
    let searchID;

    if (req.params.deleteID === 'google') {
        searchID = req.user.googleID;
        searchType = 'googleID'
    }
    if (req.params.deleteID === 'database') {
        searchID = req.body.databaseTabID;
        searchType = 'databaseTabID';
        updateUrlTable(req.body.databaseTabID);
    }

    const query = 'DELETE FROM tabs WHERE ?? = ?';
    const insert = [searchType, searchID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if (err) console.log('Error, DELETE: ', err);
        const output = {
            type: 'DELETE',
            success: true,
            data: results,
            fields: fields
        };
        console.log('DELETE data: ', output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.put('/', ensureAuthenticated, checkIfTableExists, (req, res) => {
    const { databaseTabID, tabTitle, browserTabIndex, url, favicon } = req.body;

    const query = 'UPDATE tabs SET tabTitle=?, browserTabIndex=?, url=?, favicon=? WHERE databaseTabID = ? LIMIT 1';
    const insert = [tabTitle, browserTabIndex, url, favicon, databaseTabID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if (err) console.log('Error, UPDATE: ', err);
        const output = {
            type: 'UPDATE',
            success: true,
            data: results.message,
            fields: fields
        };
        console.log('UPDATE data: ', output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.put('/move', ensureAuthenticated, (req, res) => {
    const { databaseTabID, browserTabIndex } = req.body;

    const query = 'UPDATE tabs SET browserTabIndex=? WHERE databaseTabID = ? LIMIT 1';
    const insert = [browserTabIndex, databaseTabID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if (err) console.log('Error, UPDATE[MOVE]: ', err);
        const output = {
            type: 'UPDATE - TAB MOVED',
            success: true,
            data: results.message,
            fields: fields
        }
        console.log(output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.put('/:time', ensureAuthenticated, checkIfTableExists, (req, res) => {

    const { databaseTabID, url } = req.body;

    if (req.params.time === 'deactivatedTime' && url) {
        updateUrlTable(databaseTabID, req);
    };

    let time = new Date();
    time = time.getTime();

    const query = 'Update tabs SET ?? = ? WHERE databaseTabID = ? LIMIT 1';
    const insert = [req.params.time, time, databaseTabID];

    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if (err) console.log('Error, TIMEUPDATE: ', err);
        const output = {
            type: req.params.time,
            success: true,
            data: results.message,
            fields: fields
        };
        console.log('UPDATE TIMESTAMP type: ', req.params.time, ' data: ', output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

module.exports = router;
