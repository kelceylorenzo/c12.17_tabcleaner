const express = require('express');
const router = express.Router();
const path = require('path');
const mysqlCredentials = require('../mysqlCredentials.js');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to remote DB");
});

function checkIfTableExists(req, res, next) {
    db.query(
        "CREATE TABLE IF NOT EXISTS tabs (" +
        "databaseTabID MEDIUMINT(8) NOT NULL PRIMARY KEY AUTO_INCREMENT," +
        "windowID MEDIUMINT(8) NULL ," +
        "tabTitle VARCHAR(200) NULL," +
        "activatedTime double NULL," +
        "deactivatedTime double NULL," +
        "browserTabIndex int(10) NULL," +
        "googleID double NULL," +
        "url VARCHAR(2084) NULL," +
        "favicon VARCHAR(2084) NULL );",
        (err, results, fields) => {
            if (err) throw err;
        }
    );
    next();
};

router.get('/', (req, res) => {

    const query = 'SELECT * FROM tabs WHERE googleID=?';
    const inserts = req.body.googleID;
    const sql = mysql.format(query, insert);

    db.query(sql, function (err, results, fields) {
	    if(err) console.log('Error, GET: ', err);
        const output = {
	    type: 'GET',
            success: true,
            data: results.message
        }
        const json_output = JSON.stringify(output);
        res.send(json_output);
	    console.log('GET from: ', req.body.googleID);
    });
});

router.post('/', checkIfTableExists, (req, res) => {
    const { windowID, tabTitle, activatedTime, deactivatedTime, browserTabIndex, googleID, url, favicon } = req.body;

    const query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const inserts = ['tabs', 'windowID', 'tabTitle', 'activatedTime', 'deactivatedTime', 'browserTabIndex', 'googleID', 'url', 'favicon',
                              windowID,   tabTitle,   activatedTime,   deactivatedTime,   browserTabIndex,   googleID,   url,   favicon];
    const sql = mysql.format(query, inserts);

    db.query(sql, (err, results, fields) => {
        if(err) console.log('Error, POST: ', err);
        const output = {
	    type: 'POST',
            success: true,
            affectedRows: results.affectedRows,
	    databaseID: insertId,
            fields: fields
        };
        console.log('POST from ', googleID, 'Data: ', output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.delete('/:deleteID', (req, res) => {

    let searchType;
    let searchID;

    if(req.params.deleteID === 'google'){
        searchID = req.body.googleID
        searchType = 'googleID'
    }
    if(req.params.deleteID === 'database'){
        searchID = req.body.databaseTabID;
        searchType = 'databaseTabID';
    };

    const query = 'DELETE FROM tabs WHERE ?? = ?';
    const insert = [searchType, searchID];
    const sql = mysql.format(query, insert);

    console.log(sql);

    db.query(sql, (err, results, fields) => {
        if(err) console.log('Error, DELETE: ', err);
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

router.put('/', checkIfTableExists, (req, res) => {
    const { databaseTabID, tabTitle, browserTabIndex, url, favicon } = req.body;

    const query = 'UPDATE tabs SET tabTitle=?, browserTabIndex=?, url=?, favicon=? WHERE databaseTabID = ? LIMIT 1';
    const insert = [tabTitle, browserTabIndex, url, favicon, databaseTabID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if(err) console.log('Error, UPDATE: ', err);
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

router.put('/move', (req, res) => {
    const {databaseTabID, browserTabIndex} = req.body;

    const query = 'UPDATE tabs SET browserTabIndex=? WHERE databaseTabID = ? LIMIT 1';
    const insert = [browserTabIndex, databaseTabID];
    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if(err) console.log('Error, UPDATE[MOVE]: ', err);
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

router.put('/:time', checkIfTableExists, (req, res) => {

    let time = new Date();
    time = time.getTime();

    const { databaseTabID } = req.body;

    const query = 'Update tabs SET ?? = ? WHERE databaseTabID = ? LIMIT 1';
    const insert = [req.params.time, time, databaseTabID];

    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if(err) console.log('Error, TIMEUPDATE: ', err);
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
