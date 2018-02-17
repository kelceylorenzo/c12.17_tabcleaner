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

    const query = 'SELECT * FROM tabs WHERE googleID=?';
    const inserts = req.body.googleID;

    const sql = mysql.format(query, insert);

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
    const { windowID, tabTitle, activatedTime, deactivatedTime, browserTabIndex, googleID, url, favicon } = req.body;

    const query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const inserts = ['tabs', 'windowID', 'tabTitle', 'activatedTime', 'deactivatedTime', 'browserTabIndex', 'googleID', 'url', 'favicon',
        windowID, tabTitle, activatedTime, deactivatedTime, browserTabIndex, googleID, url, favicon];

        const sql = mysql.format(query, inserts);

    function insertRow(){ 
        db.query(sql, (err, results, fields) => {
        console.log('err: ', err);
        if (err) throw err;
        const output = {
            success: true,
            data: results,
            fields: fields
        }
        console.log(output);
        const json_output = JSON.stringify(output);
        res.json(output);
    })};

    const creatTblSql = "CREATE TABLE tabs ("+
        "databaseTabID MEDIUMINT(8) NOT NULL PRIMARY KEY AUTO_INCREMENT,"+
        "windowID MEDIUMINT(8) NULL ,"+
        "tabTitle VARCHAR(200) NULL,"+
        "activatedTime double NULL,"+
        "deactivatedTime double NULL,"+
        "browserTabIndex int(10) NULL,"+
        "googleID double  NULL,"+
        "url VARCHAR(2084) NULL,"+
        "favicon VARCHAR(2084) NULL"+
      ");"

    const tblChkSql = "SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = 'closeyourtabs') AND (TABLE_NAME = 'tabs');";

    db.query(tblChkSql, (err, results, fields) => {
        console.log('results: ', results);
        console.log('fields', fields);
        if(results.count == 0 ){
            db.query(creatTblSql, (err, results, fields)=>{
                insertRow();
            })
        } else {
            insertRow();
        }
    });
});

router.delete('/', (req, res) => {
    const { databaseTabID } = req.body;

    const query = 'DELETE FROM tabs WHERE databaseTabID = ?';
    const insert = databaseTabID;

    const sql = mysql.format(query, insert);
    console.log(sql);

    db.query(sql, (err, results, fields) => {
        console.log('err: ', err);
        if (err) throw err;
        const output = {
            success: true,
            data: results,
            fields: fields
        }
        console.log(output);
        const json_output = JSON.stringify(output);
        res.json(output);
    });
});

router.delete('/id', (req, res) => {
    const { googleID } = req.body;

    const query = 'DELETE FROM tabs WHERE googleID = ?';
    const insert = googleID;

    const sql = mysql.format(query, insert);

    db.query(sql, (err, results, fields) => {
        console.log('err: ', err);
        if (err) throw err;
        const output = {
            success: true,
            data: results,
            fields: fields
        }
        console.log(output);
        const json_output = JSON.stringify(output);
        res.json(output);
    });
});


router.put('/', (req, res) => {

    const { databaseTabID, tabTitle, browserTabIndex, url, favicon } = req.body;

    const query = 'UPDATE tabs SET tabTitle=?, browserTabIndex=?, url=?, favicon=? WHERE databaseTabID = ? LIMIT 1';
    const insert = [tabTitle, browserTabIndex, url, favicon, databaseTabID];

    const sql = mysql.format(query, insert);
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

    let time = new Date();
    time = time.getTime();

    const { databaseTabID } = req.body;

    const query = 'Update tabs SET activatedTime = ? WHERE databaseTABID = ? LIMIT 1';
    const insert = [time, databaseTabID];

    const sql = mysql.format(query, insert);

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

router.put('/deactivated', (req, res) => {
    let time = new Date();
    time = time.getTime();

    const { databaseTabID, googleID } = req.body;

    const query = 'Update tabs SET WHERE databaseTABID = ? LIMIT 1';
    const insert = [time, databaseTabID];

    const sql = mysql.format(query, insert);

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
