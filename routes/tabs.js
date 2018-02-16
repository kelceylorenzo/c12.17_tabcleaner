const express = require('express');
const router = express.Router();
const path = require('path');
const mysqlCredentials = require('../mysqlCredentials.js');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected to remote DB");
});

router.use(express.static(path.join(__dirname, 'html')));

router.get('/', (req, res) => {

    let query = 'SELECT * FROM tabs WHERE googleID=?';
    let inserts = req.body.googleID;

    let sql = mysql.format(query, insert);

    db.query(sql, function (err, rows, fields) {
        const output = {
            success: true,
            data: rows
        }
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.post('/', (req, res) => {
    console.log('post: ', req.body);

    const { windowID, tabTitle, activatedTime, deactivatedTime, googleTabIndex, googleID, url, favicon } = req.body;

    let query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    let inserts = ['tabs', 'windowID', 'tabTitle', 'activatedTime', 'deactivatedTime', 'googleTabIndex', 'googleID', 'url', 'favicon',
        windowID, tabTitle, activatedTime, deactivatedTime, googleTabIndex, googleID, url, favicon];

    let sql = mysql.format(query, inserts);

    console.log(err);

    db.query(sql, (err, results, fields) => {
        console.log('err: ', err);
        if (err) throw err;
        const output = {
            success: true,
            data: results,
            fields: fields
        }
        console.log(output);
        res.json(output);
    });
});

router.delete('/', function () {
    const { databaseTabID } = req.body;

    let query = 'DELETE * FROM tabs WHERE databaseTabId = ?';
    let insert = databaseTabID;

    let sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if (err) throw err;
        console.log(fields);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });
});

router.put('/', (req, res) => {

    const { databaseTabID, tabTitle, googleTabIndex, url, favicon } = req.body;

    let query = 'UPDATE tabs SET ??=? ??=? ??=? ??=? WHERE databaseTabID = ?';
    let insert = ['tabTitle', 'googleTabIndex', 'url', 'favicon', tabTitle, googleTabIndex, url, favicon, databaseTabID];

    let sql = mysql.format(query, insert);
    console.log(sql);

    db.query(sql, (err, results, fields) => {
        if (err) throw err;
        const output = {
            success: true,
            data: results,
            fields: fields
        }
        console.log(output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });


});

router.put('/activated', (req, res) => {

    const time = new Date();
    time = time.getTime();

    const { databaseTabID } = req.body;

    let query = 'Update tabs SET activatedTime = ?'
    let insert = time;

    let sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if (err) throw err;
        const output = {
            success: true,
            data: results,
            fields: fields
        }
        console.log(output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    })
});

router.put('/deactivated', (req, res) => {
    const time = new Date();
    time = time.getTime();

    const { databaseTabID } = req.body;

    let query = 'Update tabs SET deactivatedTime = ?'
    let insert = time;

    let sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        if (err) throw err;
        const output = {
            success: true,
            data: results,
            fields: fields
        }
        console.log(output);
        const json_output = JSON.stringify(output);
        res.send(json_output);
    });




});

module.exports = router;
