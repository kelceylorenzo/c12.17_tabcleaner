const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');
const mysqlCredentials = require('../mysqlCredentials.js');
const mysql = require('mysql');
const db = mysql.createConnection(mysqlCredentials);

const PORT = 3000;

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to remote DB");
});


router.use(express.static(path.join(__dirname, 'html')));

router.get('/tabs', (req, res)=>{
    let query = 'SELECT * FROM tabs WHERE googleID='+req.body.id;
    db.connect(function(){
        db.query(query, function(err, reults, fields){
            const output = {
                success: true,
                data: rows
            }
            console.log(fields);
            const json_output = JSON.stringify( output );
            res.send(json_output);
        })
    })
});

router.post('/tabs', (req, res)=>{
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

router.delete('/tabs', function(){

});

router.put('/tabs', function(){

});

module.exports = router;