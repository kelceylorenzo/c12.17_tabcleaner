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
    db.connect(function(){
        db.query('SELECT * FROM tabs', function(err, roapp, fields){
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

router.post('/', function(){

});

router.delete('/', function(){

});

router.put('/', function(){

});

module.exports = router;
