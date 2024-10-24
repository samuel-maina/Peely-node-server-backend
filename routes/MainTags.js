var express = require('express');
var router = express.Router();
var MysqlConnection = require( '../datalayer/MysqlConnection');
 const conn = MysqlConnection.createConnection();
/* GET users listing. */
router.get('/maintags', function (req, res, next) {
    
   var resultset=[];
       
       conn.query('select * from main_tags', function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
    
  });
     
    
   return resultset;
});

router.get('/article/:id', function (req, res, next) {
    var articleId = req.params['id'];
   var resultset=[];
       
       conn.query('select * from blog where id =?',[articleId], function (err, result, fields) {
    if (err) throw err;
    res.status(200).json(result);
    console.log(result);
  });
     console.log(resultset); 
    
   return resultset;
});

module.exports = router;
