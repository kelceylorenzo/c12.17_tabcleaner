const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');
const mysqlCredentials = require('../mysqlCredentials.js');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to remote DB");
});

router.use(express.static(path.join(__dirname, 'html')));

router.get('/', (req, res)=>{
    console.log('hi');
    let query = 'SELECT * FROM tabs ';
    db.connect(function(){
        db.query(query, function(err, reults, fields){
            const output = {
                success: true,
                data: rows
            }
            console.log(fields);
            const json_output = JSON.stringify( output );
            res.send(json_output);
        });
    });
});

router.post('/', (req, res)=>{

    const {windowID, tabTitle, activeTimeElapsed, inactiveTimeElapsed, googleTabIndex, url} = req.body;

    router.get('/auth/google/verify', (req, res)=>{
        const {googleID} = req.user;

    }).then((googleID)=>{
        let query = 'INSERT INTO ?? (??, ??, ??, ??, ??, ??)VALUES (?, ?, ?, ?, ?, ?)';
        let inserts = ['tabs','windowID', 'tabTitle', 'activeTimeElapsed', 'inactiveTimeElapsed', 'googleTabIndex', 'googleID', 'url', , last, email, username, password, status];
    });
    /// FINISH QUERY
    
});

router.delete('/', function(){
    let query = 'DELETE * FROM tabs WHERE googleID='+req.body.id;
    db.connect(function(){
        db.query(query, function(err, results, fields){
            if(err) throw err;
            console.log(fields);
            const json_output = JSON.stringify( output );
            res.send(json_output);
        })
    })
});

router.put('/', (req, res)=>{
    const {databaseTabID} = req.body;

});

module.exports = router;