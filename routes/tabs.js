const express = require('express');
const router = express.Router();
const app = express();
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
    let query = 'SELECT * FROM tabs ';
    db.connect(function () {
        db.query(query, function (err, reults, fields) {
            const output = {
                success: true,
                data: rows
            }
            const json_output = JSON.stringify(output);
            res.send(json_output);
        });
    });
});

router.post('/', (req, res, err) => {
    console.log("post, hi");

    const { windowID, tabTitle, activatedTime, deactivatedTime, googleTabIndex, googleID, url } = req.body;

    let query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?, ?. ?)';
    let inserts = ['tabs', 'windowID', 'tabTitle', 'activatedTime', 'deactivatedTime', 'googleTabIndex', 'googleID', 'url',
        windowID, tabTitle, activatedTime, deactivatedTime, googleTabIndex, googleID, url];

    let sql = mysql.format(query, inserts);

    console.log(err);

    db.query(sql, (err, results, fields) => {
        console.log("err: ", err);
        if (err) throw err;
        const output = {
            success: true,
            data: results
        }
        console.log(output);
        res.json(output);
    });

});

router.delete('/', function () {
    let query = 'DELETE * FROM tabs WHERE googleID=' + req.body.id;
    db.connect(function () {
        db.query(query, function (err, results, fields) {
            if (err) throw err;
            console.log(fields);
            const json_output = JSON.stringify(output);
            res.send(json_output);
        })
    })
});

router.put('/', (req, res) => {
    const { databaseTabID } = req.body;

});

router.put('/activated', (req, res) => {
    const time = new Date();
    time = time.getTime();

    let query = 'DELETE * FROM tabs WHERE googleID=' + req.body.id;
    db.connect(function () {
        db.query(query, function (err, results, fields) {
            if (err) throw err;
            console.log(fields);
            const json_output = JSON.stringify(output);
            res.send(json_output);
        })
    })

});

router.put('/deactivated', (req, res) => {
    const time = new Date();
    time = time.getTime();


});

module.exports = router;