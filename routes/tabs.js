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

<<<<<<< HEAD
router.get('/', (req, res) => {
=======
router.get('/', (req, res)=>{

    console.log('hi');
>>>>>>> a0af37e8e5322a4f5ed3193e0d811e193f846f89
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

<<<<<<< HEAD
router.post('/', (req, res) => {
    const { windowID, tabTitle, activatedTime, deactivatedTime, googleTabIndex, googleID, url } = req.body;

    let query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?, ?. ?)';
    let inserts = ['tabs', 'windowID', 'tabTitle', 'activatedTime', 'deactivatedTime', 'googleTabIndex', 'googleID', 'url',
        windowID, tabTitle, activatedTime, deactivatedTime, googleTabIndex, googleID, url];

    let sql = mysql.format(query, inserts);

    db.query(sql, (err, results, fields) => {
        if (err) throw err;
        const output = {
            success: true,
            data: results
        }
        console.log(output);
        res.json(output);
    })
=======
router.post('/', (req, res)=>{
    const {windowID, tabTitle, activeTimeElapsed, inactiveTimeElapsed, googleTabIndex, url} = req.body;
    router.get('/auth/google/verify', (req, res)=>{
        const {googleID} = req.user;
    }).then((googleID)=>{
        let query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?, ?)';
        let inserts = ['tabs','windowID', 'tabTitle', 'activeTimeElapsed', 'inactiveTimeElapsed', 'googleTabIndex', 'googleID', 'url', , last, email, username, password, status];
    });
>>>>>>> a0af37e8e5322a4f5ed3193e0d811e193f846f89
    /// FINISH QUERY
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

<<<<<<< HEAD
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


=======

router.put('/', (req, res)=>{
    const {databaseTabID} = req.body;
});

module.exports = router;
>>>>>>> a0af37e8e5322a4f5ed3193e0d811e193f846f89
